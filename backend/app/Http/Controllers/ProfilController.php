<?php

namespace App\Http\Controllers;

use App\Models\Conge_annuels;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use App\Models\Demande;
use App\Models\Personnel;


class ProfilController extends Controller
{
    public function getCongeAnnuel()
    {
        try {
            Log::info('=== DÉBUT getCongeAnnuel ===');

            // Vérifier que l'utilisateur est authentifié via JWT
            $personnel = JWTAuth::parseToken()->authenticate();

            if (!$personnel) {
                Log::error('Personnel non trouvé après authentification JWT');
                return response()->json(['message' => 'Non autorisé'], 401);
            }





            $IM = $personnel->IM;
            $congeAnnuel = Conge_annuels::where('IM', $IM)->get();



            // Si aucun congé trouvé, créer des données de test
            if ($congeAnnuel->isEmpty()) {
                Log::info('Aucun congé trouvé, création de données de test');
                return response()->json(
                    [
                        "reponse" => "Aucun congé annuel trouvé pour l'IM: $IM"

                    ],
                    200
                );
            }

            Log::info('=== FIN getCongeAnnuel ===');
            return response()->json($congeAnnuel, 200);
        } catch (\Exception $e) {
            Log::error('Erreur dans getCongeAnnuel:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['message' => 'Erreur serveur: ' . $e->getMessage()], 500);
        }
    }
    public function faireDemande(Request $request)
    {
        try {
            $personnel = JWTAuth::parseToken()->authenticate();
            if (!$personnel) {
                Log::error('Personnel non trouvé après authentification JWT');
                return response()->json(['message' => 'Non autorisé'], 401);
            }

            $validatedData = $request->validate([
                'ref' => 'nullable|integer',
                'IM' => 'required|string',
                'CATEGORIE' => 'required|string',
                'TYPE' => 'required|string',
                'MOTIF' => 'required|string',
                'DATEDEBUT' => 'required|date',
                'DATEFIN' => 'required|date',
                'VALIDDIV' => 'nullable|string',
                'VALIDCHEF' => 'nullable|string',
                'LIEU' => 'nullable|string',
                'INTERIM' => 'nullable|string',
                'ABSENCE' => 'nullable|string',
            ]);
            $nb_jour = (new \DateTime($validatedData['DATEFIN']))->diff(new \DateTime($validatedData['DATEDEBUT']))->days + 1;
            if ($nb_jour <= 0) {
                return response()->json(['message' => 'La date de fin doit être postérieure à la date de début.'], 400);
            }
            $totalSolde = Conge_annuels::where('IM', $validatedData['IM'])->sum('NBR_CONGE');
            if ($totalSolde < $nb_jour) {
                return response()->json(['message' => 'Solde de congé annuel insuffisant. Vous avez ' . $totalSolde . ' jour(s) disponible(s).'], 400);
            }
            $demande = Demande::create($validatedData);
            
            return response()->json(['message' => 'Demande créée avec succès.'], 201);
        } catch (\Exception $e) {
            Log::error('Erreur dans faireDemande:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['message' => 'Erreur serveur: ' . $e->getMessage()], 500);
        }
    }
}
