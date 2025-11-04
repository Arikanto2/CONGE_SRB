<?php

namespace App\Http\Controllers;

use App\Models\Conge_annuels;
use App\Models\Demande;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class AccueilController extends Controller
{

    public function index(Request $request)
        {
            $im = $request->query('im');
            $division = $request->query('division');

            $dernieresDemandes = Demande::where('IM', $im)
                   ->orderBy('DATEDEBUT', 'desc')
                   ->limit(3)
                   ->get(['DATEDEBUT', 'DATEFIN', 'VALIDCHEF']);

            $Total_conge = Conge_annuels::where('IM', $im)->sum('NBR_CONGE');
            
            $Valid_div = Demande::join('personnel', 'conge_absence.IM', '=', 'personnel.IM')
                ->where('conge_absence.VALIDDIV', 'En attente')
                ->where('personnel.DIVISION', $division)
                ->get([
                    'personnel.NOM',
                    'conge_absence.IM',
                    'conge_absence.MOTIF',
                    'conge_absence.DATEDEBUT',
                 DB::raw('(conge_absence."DATEFIN" - conge_absence."DATEDEBUT") AS duree')
            ]);

            $Valid_chef = Demande::join('personnel', 'conge_absence.IM', '=', 'personnel.IM')
                ->where('conge_absence.VALIDDIV', 'Validé')
                ->where('conge_absence.VALIDCHEF', 'En attente')           
                ->get([
                    'personnel.NOM',
                    'conge_absence.IM',
                    'conge_absence.MOTIF',
                    'conge_absence.DATEDEBUT',
                    DB::raw('(conge_absence."DATEFIN" - conge_absence."DATEDEBUT") AS duree')
            ]);

            $congesParMois = DB::table('conge_absence')
                ->selectRaw('
                    EXTRACT(MONTH FROM "DATEDEBUT")::INT AS mois,
                    COUNT(*) AS total_conges
                ')
                ->where('VALIDCHEF', 'Validé')
                ->groupByRaw('EXTRACT(MONTH FROM "DATEDEBUT")')
                ->orderByRaw('EXTRACT(MONTH FROM "DATEDEBUT")')
                ->get();

            return response()->json([
                  'dernieres_demandes' => $dernieresDemandes,
                  'nbr_Conge' => $Total_conge,
                  'validation_div' => $Valid_div,
                  'validation_chef' => $Valid_chef,
                  'conges_par_mois' => $congesParMois
                ]);
        }

    public function create()
    {
        /*
        $nb_jour = (new \DateTime($validatedData['DATEFIN']))->diff(new \DateTime($validatedData['DATEDEBUT']))->days + 1;
            if ($nb_jour <= 0) {
                return response()->json(['message' => 'La date de fin doit être postérieure à la date de début.'], 400);
            }
                $congeAnnuel = Conge_annuels::where('IM', $validatedData['IM'])->where('NBR_CONGE' != 0)->orderBy('ANNEE','desc')->get();
            foreach ($congeAnnuel as $conge) {
                if ($conge->NBR_CONGE - $nb_jour >= 0) {
                    $conge->NBR_CONGE -= $nb_jour;
                    $conge->save();
                    return response()->json(['message' => 'Demande créée avec succès et congé annuel mis à jour.'], 201);
                } else {
                    $conge->NBR_CONGE = 0;
                    $nb_jour -= $conge->NBR_CONGE;
                    $conge->save();
                }
            }
            
                
*/
    }

    public function store(Request $request) {}


    public function show(string $id) {}


    public function edit(string $id) {}


    public function update(Request $request, string $id) {}


    public function destroy(string $id) {}
}
