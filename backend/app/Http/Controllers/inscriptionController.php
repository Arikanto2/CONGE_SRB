<?php

namespace App\Http\Controllers;

use App\Models\Conge_annuels;
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
            'NOM' => ['required', 'string', 'max:128'],
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

        // Forcer IM_Chef à null pour maintenir la cohérence avant l'assignation automatique
        $validated['IM_Chef'] = null;

        // Supprimer IM_CHEF du frontend si présent
        if (isset($validated['IM_CHEF'])) {
            unset($validated['IM_CHEF']);
        }

        // Log des données finales avant création
        Log::info('Données finales avant création du personnel:', $validated);

        $personnel = Personnel::create($validated);

        // Appeler l'assignation automatique après la création
        try {
            $this->autoAssignerIM_Chef();
            Log::info('Assignation automatique des IM_Chef exécutée après inscription');
        } catch (\Exception $autoAssignException) {
            Log::error('Erreur lors de l\'assignation automatique après inscription:', ['error' => $autoAssignException->getMessage()]);
            // Ne pas faire échouer l'inscription si l'assignation automatique échoue
        }

        return response()->json([
            'message' => 'Inscription réussie',
            'personnel' => $personnel
        ], 201);
    }
    public function autoAssignerIM_Chef()
    {
        try {
            // 1. Récupérer le Chef de service
            $chefService = Personnel::where('FONCTION', 'Chef de service')->first();

            if ($chefService) {
                // 2. Assigner le Chef de service à tous les Chefs de division
                Personnel::where('FONCTION', 'Chef de division')
                    ->update(['IM_Chef' => $chefService->IM]);

                Log::info('Chefs de division mis à jour avec le Chef de service', ['IM_Chef' => $chefService->IM]);
            }

            // 3. Pour chaque division, assigner le Chef de division aux Personnels de cette division
            $divisions = Personnel::where('FONCTION', 'Chef de division')
                ->select('DIVISION', 'IM')
                ->get();

            foreach ($divisions as $chefDivision) {
                Personnel::where('FONCTION', 'Personnel')
                    ->where('DIVISION', $chefDivision->DIVISION)
                    ->update(['IM_Chef' => $chefDivision->IM]);

                Log::info('Personnels de la division mis à jour', [
                    'division' => $chefDivision->DIVISION,
                    'IM_Chef' => $chefDivision->IM
                ]);
            }

            // 4. Gérer les Personnels dont la division n'a pas de Chef de division
            $personnelsSansChef = Personnel::where('FONCTION', 'Personnel')
                ->whereNotIn('DIVISION', function ($query) {
                    $query->select('DIVISION')
                        ->from('personnel')
                        ->where('FONCTION', 'Chef de division');
                })
                ->get();

            foreach ($personnelsSansChef as $personnel) {
                $personnel->update(['IM_Chef' => null]);
                Log::warning('Personnel sans Chef de division dans sa division', [
                    'personnel' => $personnel->PRENOM . ' ' . $personnel->NOM,
                    'division' => $personnel->DIVISION
                ]);
            }

            Log::info('Assignation automatique des IM_Chef terminée avec succès', [
                'chef_service' => $chefService ? $chefService->IM : null,
                'divisions_traitees' => $divisions->count(),
                'personnels_sans_chef' => $personnelsSansChef->count()
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'assignation automatique des IM_Chef:', ['error' => $e->getMessage()]);
            // Ne plus relancer l'exception pour éviter de faire échouer l'opération principale
            return false;
        }

        return true;
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
                'personnel' => $personnel->makeHidden(['MDP'])
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur JWT:', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Erreur de génération du token'], 500);
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
    public function modification(Request $request)
    {
        try {
            // Vérifier que l'utilisateur est authentifié via JWT
            $currentUser = JWTAuth::parseToken()->authenticate();

            if (!$currentUser) {
                return response()->json(['message' => 'Non autorisé'], 401);
            }

            Log::info('Modification tentée par:', ['user_id' => $currentUser->id, 'IM' => $currentUser->IM]);
            Log::info('Données reçues:', $request->all());
        } catch (\Exception $e) {
            Log::error('Erreur JWT dans modification:', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Token invalide ou expiré'], 401);
        }

        // Trouver l'ID du personnel à partir de IM_ANC
        $personnelActuel = Personnel::where('IM', $request->IM_ANC)->first();

        if (!$personnelActuel) {
            return response()->json(['message' => 'Personnel introuvable'], 404);
        }

        $rules = [
            'IM_ANC' => ['required'],
            'NOM' => ['required', 'string', 'max:128'],
            'PRENOM' => ['required', 'string', 'max:128'],
            'EMAIL' => ['required', 'email', 'max:128', 'unique:personnel,EMAIL,' . $personnelActuel->id . ',id'],
            'CORPS' => ['required', 'string', 'max:128'],
            'GRADE' => ['required', 'string', 'max:128'],
            'FONCTION' => ['required', 'string', 'max:32'],
            'CONTACT' => ['required', 'string', 'max:128'],
            'DIVISION' => ['required', 'string', 'max:128'],
            'PHOTO_PROFIL' => ['nullable', 'string'],
            'MDP' => ['nullable', 'string', 'min:8'],
        ];

        $messages = [
            'IM_ANC.required' => 'L\'ancien IM est vide.',
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
        ];

        try {
            $validated = $request->validate($rules, $messages);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Erreur de validation:', $e->errors());
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        }

        // Vérifier si un chef existe déjà (seulement si la fonction change)
        if ($personnelActuel->FONCTION !== $validated['FONCTION']) {


            if ($validated['FONCTION'] === 'Chef de service') {
                $chefServiceExistant = Personnel::where('FONCTION', 'Chef de service')
                    ->where('id', '!=', $personnelActuel->id)
                    ->first();

                if ($chefServiceExistant) {
                    return response()->json([
                        'message' => 'Un chef de service existe déjà',
                        'errors' => [
                            'FONCTION' => ['Un chef de service existe déjà : ' . $chefServiceExistant->PRENOM . ' ' . $chefServiceExistant->NOM . ' (IM: ' . $chefServiceExistant->IM . ')']
                        ]
                    ], 422);
                }
            }

            // Vérification pour Chef de division - Un seul par division
            if ($validated['FONCTION'] === 'Chef de division') {
                $chefDivisionExistant = Personnel::where('FONCTION', 'Chef de division')
                    ->where('DIVISION', $validated['DIVISION'])
                    ->where('id', '!=', $personnelActuel->id)
                    ->first();

                if ($chefDivisionExistant) {
                    return response()->json([
                        'message' => 'Un chef de division existe déjà dans cette division',
                        'errors' => [
                            'FONCTION' => ['Un chef de division existe déjà dans la division "' . $validated['DIVISION'] . '" : ' . $chefDivisionExistant->PRENOM . ' ' . $chefDivisionExistant->NOM . ' (IM: ' . $chefDivisionExistant->IM . ')']
                        ]
                    ], 422);
                }
            }
        }

        // Utiliser le personnel déjà trouvé précédemment
        $personnel = $personnelActuel;

        // Si un mot de passe est fourni, le hasher
        if (!empty($validated['MDP'])) {
            $validated['MDP'] = Hash::make($validated['MDP']);
        } else {
            unset($validated['MDP']); // Ne pas mettre à jour le mot de passe s'il est vide
        }

        // Forcer IM_Chef à null pour maintenir la cohérence avant l'assignation automatique
        $validated['IM_Chef'] = null;

        // Sauvegarder l'ancienne fonction pour comparaison
        $ancienneFonction = $personnel->FONCTION;
        $nouvelleFonction = $validated['FONCTION'];

        unset($validated['IM_ANC']);

        try {
            $personnel->update($validated);
            Log::info('Profil modifié avec succès:', ['personnel_id' => $personnel->id]);

            // Appeler l'assignation automatique après la modification
            try {
                $this->autoAssignerIM_Chef();
                Log::info('Assignation automatique des IM_Chef exécutée après modification');
            } catch (\Exception $autoAssignException) {
                Log::error('Erreur lors de l\'assignation automatique après modification:', ['error' => $autoAssignException->getMessage()]);
                // Ne pas faire échouer la modification si l'assignation automatique échoue
            }

            // Générer un nouveau token avec les données mises à jour
            $newToken = JWTAuth::fromUser($personnel);

            return response()->json([
                'message' => 'Profil modifié avec succès',
                'token' => $newToken,
                'personnel' => $personnel->makeHidden(['MDP'])
            ], 200);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la mise à jour:', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Erreur lors de la modification'], 500);
        }
    }
    public function verifyMDP(Request $request)
    {
        $request->validate([
            'ANCIEN_MDP' => 'required|string',
        ]);

        try {

            $currentUser = JWTAuth::parseToken()->authenticate();

            if (!$currentUser) {
                return response()->json(['message' => 'Non autorisé'], 401);
            }
        } catch (\Exception $e) {
            Log::error('Erreur JWT dans verifyMDP:', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Token invalide ou expiré'], 401);
        }


        if (Hash::check($request->ANCIEN_MDP, $currentUser->MDP)) {
            return response()->json(['valid' => true]);
        } else {
            return response()->json(['valid' => false]);
        }
    }
    public function changeMDP(Request $request)
    {
        $request->validate([
            'new_MDP' => [
                'required',
                'string',
                'min:8',
                'max:20',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#\s?&]{8,}$/'
            ],
            'confirm_MDP' => 'required|string|same:new_MDP',
        ], [
            'new_MDP.required' => 'Le nouveau mot de passe est obligatoire.',
            'new_MDP.min' => 'Le mot de passe doit contenir au moins 8 caractères.',
            'new_MDP.max' => 'Le mot de passe ne peut pas dépasser 20 caractères.',
            'new_MDP.regex' => 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*#?&).',
            'confirm_MDP.required' => 'La confirmation du mot de passe est obligatoire.',
            'confirm_MDP.same' => 'La confirmation du mot de passe ne correspond pas.',
        ]);

        try {
            $currentUser = JWTAuth::parseToken()->authenticate();

            if (!$currentUser) {
                return response()->json(['message' => 'Non autorisé'], 401);
            }
        } catch (\Exception $e) {
            Log::error('Erreur JWT dans changeMDP:', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Token invalide ou expiré'], 401);
        }

        $currentUser->MDP = Hash::make($request->new_MDP);
        $currentUser->save();

        return response()->json(['message' => 'Mot de passe changé avec succès']);
    }
}
