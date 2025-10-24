<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Personnel;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class InscriptionController extends Controller
{
    public function store(Request $request)
    {
        Log::info('Données reçues:', $request->all());

        $validated = $request->validate([
            'IM' => ['required', 'unique:personnel,IM'],
            'IM_CHEF' => ['nullable', 'exists:personnel,IM'],
            'NOM' => ['required', 'string', 'max:32'],
            'PRENOM' => ['required', 'string', 'max:128'],
            'EMAIL' => ['nullable', 'email', 'max:128', 'unique:personnel,EMAIL'],
            'CORPS' => ['required', 'string', 'max:128'],
            'GRADE' => ['required', 'string', 'max:128'],
            'FONCTION' => ['required', 'string', 'max:32'],
            'CONTACT' => ['nullable', 'string', 'max:128'],
            'DIVISION' => ['nullable', 'string', 'max:128'],
            'MDP' => ['required', 'string', 'min:8'],
        ]);

        if (isset($validated['IM_CHEF'])) {
            $validated['IM_Chef'] = $validated['IM_CHEF'];
            unset($validated['IM_CHEF']);
        }

        if ($request->has('PHOTO_PROFIL') && !empty($request->PHOTO_PROFIL)) {
            $validated['PHOTO_PROFIL'] = is_string($request->PHOTO_PROFIL) ? $request->PHOTO_PROFIL : '';
        } else {
            $validated['PHOTO_PROFIL'] = null;
        }

        if (!empty($validated['MDP'])) {
            $validated['MDP'] = Hash::make($validated['MDP']);
        }

        $personnel = Personnel::create($validated);

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

        // Trouver l'utilisateur par IM
        $personnel = Personnel::where('IM', $credentials['IM'])->first();

        // Vérifier les identifiants
        if (!$personnel || !Hash::check($credentials['MDP'], $personnel->MDP)) {
            return response()->json(['message' => 'Identifiants incorrects'], 401);
        }

        // Générer un token JWT
        try {
            /** @var \Tymon\JWTAuth\JWTGuard $jwt */
            $jwt = auth('api');

            // Connecter l'utilisateur manuellement et générer le token
            $token = $jwt->login($personnel);

            return response()->json([
                'message' => 'Connexion réussie',
                'token' => $token,
                'personnel' => [
                    'id' => $personnel->id,
                    'IM' => $personnel->IM,
                    'NOM' => $personnel->NOM,
                    'PRENOM' => $personnel->PRENOM,
                    'EMAIL' => $personnel->EMAIL,
                    'FONCTION' => $personnel->FONCTION,
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur JWT:', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Erreur de génération du token'], 500);
        }
    }

    public function verifyToken(Request $request)
    {
        try {
            /** @var \Tymon\JWTAuth\JWTGuard $jwt */
            $jwt = auth('api');
            $user = $jwt->user();

            if ($user) {
                return response()->json([
                    'valid' => true,
                    'user' => [
                        'id' => $user->id,
                        'IM' => $user->IM,
                        'NOM' => $user->NOM,
                        'PRENOM' => $user->PRENOM,
                        'EMAIL' => $user->EMAIL,
                        'FONCTION' => $user->FONCTION,
                    ]
                ]);
            }

            return response()->json(['valid' => false], 401);
        } catch (\Exception $e) {
            return response()->json(['valid' => false], 401);
        }
    }

    public function getUser(Request $request)
    {
        try {
            /** @var \Tymon\JWTAuth\JWTGuard $jwt */
            $jwt = auth('api');
            $user = $jwt->user();

            return response()->json([
                'user' => [
                    'id' => $user->id,
                    'IM' => $user->IM,
                    'NOM' => $user->NOM,
                    'PRENOM' => $user->PRENOM,
                    'EMAIL' => $user->EMAIL,
                    'FONCTION' => $user->FONCTION,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Utilisateur non trouvé'], 401);
        }
    }

    public function logout(Request $request)
    {
        /** @var \Tymon\JWTAuth\JWTGuard $jwt */
        $jwt = auth('api');
        $jwt->logout();

        return response()->json([
            'message' => 'Déconnexion réussie',
            'status' => 'success'
        ]);
    }
}
