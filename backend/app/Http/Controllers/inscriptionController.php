<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Personnel;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class InscriptionController extends Controller
{
    public function store(Request $request)
    {
        Log::info('Données reçues:', $request->all());

        // Règles de validation
        $rules = [
            'IM' => ['required', 'unique:personnel,IM'],
            'IM_CHEF' => ['nullable', 'exists:personnel,IM'], // Frontend envoie IM_CHEF
            'NOM' => ['required', 'string', 'max:32'],
            'PRENOM' => ['required', 'string', 'max:128'],
            'EMAIL' => ['required', 'email', 'max:128', 'unique:personnel,EMAIL'],
            'CORPS' => ['required', 'string', 'max:128'],
            'GRADE' => ['required', 'string', 'max:128'],
            'FONCTION' => ['required', 'string', 'max:32'],
            'CONTACT' => ['required', 'string', 'max:128'],
            'DIVISION' => ['required', 'string', 'max:128'],
            'MDP' => ['required', 'string', 'min:8'],
        ];

        // Messages d'erreur personnalisés en français
        $messages = [
            'IM.required' => 'L\'IM est obligatoire.',
            'IM.unique' => 'Cet IM est déjà utilisé par un autre personnel.',
            'EMAIL.required' => 'L\'email est obligatoire.',
            'EMAIL.email' => 'Le format de l\'email n\'est pas valide.',
            'EMAIL.unique' => 'Cette adresse email est déjà utilisée par un autre personnel.',
            'NOM.required' => 'Le nom est obligatoire.',
            'PRENOM.required' => 'Le prénom est obligatoire.',
            'CORPS.required' => 'Le corps est obligatoire.',
            'GRADE.required' => 'Le grade est obligatoire.',
            'FONCTION.required' => 'La fonction est obligatoire.',
            'CONTACT.required' => 'Le contact est obligatoire.',
            'DIVISION.required' => 'La division est obligatoire.',
            'MDP.required' => 'Le mot de passe est obligatoire.',
            'MDP.min' => 'Le mot de passe doit contenir au moins 8 caractères.',
        ];

        // Validation avec messages personnalisés
        try {
            $validated = $request->validate($rules, $messages);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Retourner les erreurs de validation avec un format JSON propre
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        }

        // Vérifications supplémentaires avec messages spécifiques
        $existingIM = Personnel::where('IM', $validated['IM'])->first();
        if ($existingIM) {
            return response()->json([
                'message' => 'Erreur de création',
                'errors' => [
                    'IM' => ['L\'IM "' . $validated['IM'] . '" est déjà attribué au personnel ' . $existingIM->PRENOM . ' ' . $existingIM->NOM . '.']
                ]
            ], 422);
        }

        $existingEmail = Personnel::where('EMAIL', $validated['EMAIL'])->first();
        if ($existingEmail) {
            return response()->json([
                'message' => 'Erreur de création',
                'errors' => [
                    'EMAIL' => ['L\'adresse email "' . $validated['EMAIL'] . '" est déjà utilisée par ' . $existingEmail->PRENOM . ' ' . $existingEmail->NOM . '.']
                ]
            ], 422);
        }

        if ($request->has('PHOTO_PROFIL') && !empty($request->PHOTO_PROFIL)) {
            $validated['PHOTO_PROFIL'] = is_string($request->PHOTO_PROFIL) ? $request->PHOTO_PROFIL : '';
        } else {
            $validated['PHOTO_PROFIL'] = null;
        }

        if (!empty($validated['MDP'])) {
            $validated['MDP'] = Hash::make($validated['MDP']);
        }

        // Assignation automatique du chef hiérarchique
        if ($validated['FONCTION'] === 'Chef de division') {
            $chefService = Personnel::where('FONCTION', 'Chef de service')->first();
            if ($chefService) {
                $validated['IM_CHEF'] = $chefService->IM;
                Log::info('Chef de division créé - IM_CHEF assigné:', ['IM_CHEF' => $chefService->IM, 'Chef' => $chefService->PRENOM . ' ' . $chefService->NOM]);
            } else {
                Log::warning('Aucun Chef de service trouvé pour assigner comme IM_CHEF du Chef de division');
                $validated['IM_CHEF'] = null;
            }
        } else if ($validated['FONCTION'] === 'Personnel') {
            $chefDivision = Personnel::where('FONCTION', 'Chef de division')
                ->where('DIVISION', $validated['DIVISION'])
                ->first();
            if ($chefDivision) {
                $validated['IM_CHEF'] = $chefDivision->IM;
                Log::info('Personnel créé - IM_CHEF assigné:', ['IM_CHEF' => $chefDivision->IM, 'Chef' => $chefDivision->PRENOM . ' ' . $chefDivision->NOM]);
            } else {
                Log::warning('Aucun Chef de division trouvé dans la division: ' . $validated['DIVISION']);
                $validated['IM_CHEF'] = null;
            }
        } else if ($validated['FONCTION'] === 'Chef de service') {
            $validated['IM_CHEF'] = null;
            Log::info('Chef de service créé - IM_CHEF = null (pas de supérieur)');
        }

        // Conversion du nom de champ pour correspondre à la DB (IM_CHEF -> IM_Chef)
        if (isset($validated['IM_CHEF'])) {
            $validated['IM_Chef'] = $validated['IM_CHEF'];
            unset($validated['IM_CHEF']);
        }

        // Log des données finales avant création
        Log::info('Données finales avant création du personnel:', $validated);

        $personnel = Personnel::create($validated);

        if ($validated['FONCTION'] === 'Chef de division') {
            Personnel::where('FONCTION', 'Personnel')
                ->where('DIVISION', $validated['DIVISION'])
                ->update(['IM_Chef' => $personnel->IM]);
        } else if ($validated['FONCTION'] === 'Chef de service') {
            Personnel::where('FONCTION', 'Chef de division')
                ->update(['IM_Chef' => $personnel->IM]);
        }

        return response()->json([
            'message' => 'Inscription réussie',
            'personnel' => $personnel
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'IM' => 'required|string',
            'MDP' => 'required|string',
        ]);

        $personnel = Personnel::where('IM', $credentials['IM'])->first();

        if (!$personnel || !Hash::check($credentials['MDP'], $personnel->MDP)) {
            return response()->json(['message' => 'Identifiants incorrects'], 401);
        }

        try {
            $token = JWTAuth::fromUser($personnel);
            return response()->json([
                'message' => 'Connexion réussie',
                'token' => $token,
                'personnel' => $personnel->makeHidden(['MDP']) // Toutes les données sauf le mot de passe
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur JWT:', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Erreur de génération du token'], 500);
        }
    }

    public function verifyToken(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if ($user) {
                return response()->json([
                    'valid' => true,
                    'user' => $user->makeHidden(['MDP']) // Toutes les données sauf le mot de passe
                ]);
            }
            return response()->json(['valid' => false], 401);
        } catch (\Exception $e) {
            return response()->json(['valid' => false], 401);
        }
    }


    public function logout(Request $request)
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json([
                'message' => 'Déconnexion réussie',
                'status' => 'success'
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erreur lors de la déconnexion'], 500);
        }
    }

    public function verifyChefService()
    {
        $isthereChefService = Personnel::where('FONCTION', 'Chef de service')->exists();
        return response()->json(['exists' => $isthereChefService]);
    }

    public function verifyChefDivision(Request $request)
    {
        $request->validate([
            'DIVISION' => 'required|string'
        ]);

        $division = $request->input('DIVISION');

        $existingChef = Personnel::where('FONCTION', 'Chef de division')
            ->where('DIVISION', $division)
            ->first();

        if ($existingChef) {
            return response()->json([
                'exists' => true,
                'chef' => [
                    'nom' => $existingChef->NOM,
                    'prenom' => $existingChef->PRENOM,
                    'im' => $existingChef->IM
                ]
            ]);
        }

        return response()->json(['exists' => false]);
    }
}
