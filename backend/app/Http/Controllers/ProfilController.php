<?php

namespace App\Http\Controllers;

use App\Models\Conge_annuels;
use App\Models\Decision;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
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
                'IM' => 'required|integer',
                'CATEGORIE' => 'required|string|min:1',
                'TYPE' => 'nullable|string|min:1',
                'MOTIF' => 'required|string|min:1|max:500',
                'DATEDEBUT' => 'required|date|after:today',
                'DATEFIN' => 'required|date|after_or_equal:DATEDEBUT',
                'VALIDDIV' => 'nullable|string',
                'VALIDCHEF' => 'nullable|string',
                'LIEU' => 'required|string|min:1',
                'INTERIM' => 'nullable|string',
                'ABSENCE' => 'nullable|string',
            ], [
                'CATEGORIE.required' => 'La catégorie est obligatoire.',
                'CATEGORIE.min' => 'La catégorie ne peut pas être vide.',
                'TYPE.min' => 'Le type ne peut pas être vide.',
                'MOTIF.required' => 'Le motif est obligatoire.',
                'MOTIF.min' => 'Le motif ne peut pas être vide.',
                'MOTIF.max' => 'Le motif ne peut pas dépasser 500 caractères.',
                'DATEDEBUT.required' => 'La date de début est obligatoire.',
                'DATEDEBUT.after' => 'La date de début doit être supérieure à aujourd\'hui.',
                'DATEFIN.required' => 'La date de fin est obligatoire.',
                'DATEFIN.after_or_equal' => 'La date de fin doit être postérieure ou égale à la date de début.',
                'LIEU.required' => 'Le lieu est obligatoire.',
                'LIEU.min' => 'Le lieu ne peut pas être vide.',
            ]);

            // Vérifier si l'utilisateur a déjà une demande en attente
            $demande = Demande::where('IM', $validatedData['IM'])
                ->where(function ($query) {
                    $query->where('VALIDDIV', 'En attente')
                        ->orWhereNull('VALIDDIV')
                        ->orWhere('VALIDCHEF', 'En attente')
                        ->orWhereNull('VALIDCHEF');
                })
                ->exists();

            if ($demande) {
                return response()->json(['message' => 'Vous avez déjà une demande en attente de validation.'], 400);
            }

            $nb_jour = (new \DateTime($validatedData['DATEFIN']))->diff(new \DateTime($validatedData['DATEDEBUT']))->days + 1;
            if ($nb_jour <= 0) {
                return response()->json(['message' => 'La date de fin doit être postérieure à la date de début.'], 400);
            }
            if ($validatedData['CATEGORIE'] == "Autorisation d'absence") {
                if ($nb_jour > 3) {
                    return response()->json(['message' => 'Le nombre de jours pour une autorisation d\'absence ne peut pas dépasser 3 jours.'], 400);
                }
            }
            $totalSolde = Conge_annuels::where('IM', $validatedData['IM'])->sum('NBR_CONGE');
            $soldeAuto = Conge_annuels::where('IM', $validatedData['IM'])
                ->where('ANNEE', date('Y'))
                ->value('NBR_Auto');
            if ($validatedData['CATEGORIE'] == 'Congé') {
                if ($nb_jour > $totalSolde) {
                    return response()->json(['message' => 'Solde de congé annuel insuffisant.'], 400);
                }
            } elseif ($validatedData['CATEGORIE'] == 'Autorisation d\'absence') {
                if ($nb_jour > $soldeAuto) {
                    return response()->json(['message' => 'Solde d\'autorisation insuffisant.'], 400);
                }
            }
            $fonction = Personnel::where('IM', $validatedData['IM'])->value('FONCTION');
            if ($fonction != 'Personnel') {
                $validatedData['VALIDDIV'] = 'Validé';
                $validatedData['VALIDCHEF'] = 'En attente';
            } else {
                $validatedData['VALIDDIV'] = 'En attente';
                $validatedData['VALIDCHEF'] = 'En attente';
            }

            // Générer une référence unique
            $lastRef = Demande::max('Ref') ?? 0;
            $validatedData['Ref'] = $lastRef + 1;

            Demande::create($validatedData);

            return response()->json(['message' => 'Demande créée avec succès.'], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Erreurs de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Erreur dans faireDemande:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['message' => 'Erreur serveur: ' . $e->getMessage()], 500);
        }
    }
    public function getSolde($id)
    {
        $n = Conge_annuels::where('IM', $id)->sum('NBR_CONGE');
        $nb = Conge_annuels::where('IM', $id)
            ->where('ANNEE', date('Y'))
            ->value('NBR_Auto');
        return response()->json(['nbr_conge' => $n, 'nbrAuto' => $nb], 200);
    }

    public function getAlldemande($id)
    {
        $demandes = Demande::join('personnel', 'conge_absence.IM', '=', 'personnel.IM')
            ->leftJoin('personnel as chef', 'personnel.IM_Chef', '=', 'chef.IM')
            ->where('conge_absence.IM', $id)
            ->select(
                'conge_absence.*',
                'personnel.NOM',
                'personnel.PRENOM',
                'chef.NOM as NOM_CHEF',
                'chef.PRENOM as PRENOM_CHEF'
            )->orderBy('conge_absence.created_at', 'desc')
            ->get();

        return response()->json($demandes, 200);
    }
    public function getDecision($id)
    {
        $decision = Decision::where('id_conge_absence', $id)->get();
        return response()->json($decision, 200);
    }
    public function createCongeAnnuel()
    {
        $IM = Personnel::select('IM')->get();
        foreach ($IM as $personne) {
            Conge_annuels::create([
                'IM' => $personne->IM,
                'ANNEE' => date('Y'),
                'NBR_CONGE' => 30,
                'NBR_Auto' => 15,
            ]);
        }
    }
}
