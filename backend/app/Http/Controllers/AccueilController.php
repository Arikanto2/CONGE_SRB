<?php

namespace App\Http\Controllers;


use App\Models\Conge_annuels;
use App\Models\decision;
use App\Models\Demande;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class AccueilController extends Controller
{
    public function index(Request $request)
    {
        $user_im = $request->query('user_im');
        $division = $request->query('division');

        $dernieresDemandes = Demande::where('IM', $user_im)
            ->orderBy('DATEDEBUT', 'desc')
            ->limit(3)
            ->get(['DATEDEBUT', 'DATEFIN', 'VALIDCHEF']);


        $Total_conge = Conge_annuels::where('IM', $user_im)->sum('NBR_CONGE');

        $Valid_div = Demande::join('personnel', 'conge_absence.IM', '=', 'personnel.IM')
            ->where('conge_absence.VALIDDIV', 'En attente')
            ->where('personnel.DIVISION', $division)
            ->get([
                'personnel.NOM',
                'personnel.PRENOM',
                'conge_absence.IM',
                'conge_absence.MOTIF',
                'conge_absence.DATEDEBUT',
                'conge_absence.DATEFIN',
                'conge_absence.LIEU',
                'conge_absence.Ref',
                'conge_absence.id',
                DB::raw('(conge_absence."DATEFIN" - conge_absence."DATEDEBUT") AS duree')
            ]);

        $Valid_chef = Demande::join('personnel', 'conge_absence.IM', '=', 'personnel.IM')
            ->where('conge_absence.VALIDDIV', 'Validé')
            ->where('conge_absence.VALIDCHEF', 'En attente')
            ->get([
                'personnel.NOM',
                'personnel.PRENOM',
                'conge_absence.IM',
                'conge_absence.MOTIF',
                'conge_absence.DATEDEBUT',
                'conge_absence.DATEFIN',
                'conge_absence.LIEU',
                'conge_absence.Ref',
                'conge_absence.id',
                DB::raw('(conge_absence."DATEFIN" - conge_absence."DATEDEBUT") AS duree')
            ]);

        /////// historique
        $congesParMois = DB::table('conge_absence')
            ->selectRaw('
                    EXTRACT(MONTH FROM "DATEDEBUT")::INT AS mois,
                    COUNT(*) AS total_conges
                ')
            ->where('VALIDCHEF', 'Validé')
            ->groupByRaw('EXTRACT(MONTH FROM "DATEDEBUT")')
            ->orderByRaw('EXTRACT(MONTH FROM "DATEDEBUT")')
            ->get();

        $item_user = $request->query('item_im');
        $item_ref = $request->query('item_ref');

        $congeAnnuel = Conge_annuels::where('IM', $item_user)
            ->orderBy('ANNEE', 'asc')
            ->get();

        $demandeJours = Demande::where('Ref', $item_ref)
            ->selectRaw('("DATEFIN" - "DATEDEBUT") AS nb_jrs')
            ->value('nb_jrs');
        $joursADebiter = [];

        foreach ($congeAnnuel as $conge) {
            if ($demandeJours <= 0) break;

            $reste = $conge->NBR_CONGE;

            if ($reste <= 0) continue;

            $debiter = min($reste, $demandeJours);

            $joursADebiter[] = [
                'id' => $conge->id,
                'annee' => $conge->ANNEE,
                'jours' => $debiter
            ];

            $demandeJours -= $debiter;
        }
        return response()->json([
            'joursADebiter' => $joursADebiter,
            'congeAnnuel' => $demandeJours,
            'dernieres_demandes' => $dernieresDemandes,
            'nbr_Conge' => $Total_conge,
            'validation_div' => $Valid_div,
            'validation_chef' => $Valid_chef,
            'conges_par_mois' => $congesParMois,
        ]);
    }

    public function create() {}
    public function store(Request $request) {}


    public function show(string $id) {}


    public function edit(string $id) {}


    public function update(Request $request, string $id) {
        $fonction = $request->query('fonction');

        $action = $request->query('action');
        
        if(!$fonction) {
            return response()->json(['message' => 'Fonction manquante'], 400);
        }
    
        $demande = Demande::findOrFail($id);

        if ($action === 'rejeter') {
            if($fonction === 'Chef de division'){
                $demande->VALIDDIV = 'Refusé';
                $demande->VALIDCHEF = 'Refusé';
            }elseif($fonction === 'Chef de service'){
                $demande->VALIDCHEF = 'Refusé';
            } else{
                return response()->json(['message' => 'Role non autorisé'], 403);
            }
    
            $demande->save();
    
            return response()->json([
                'message' => 'Demande Refusée.'
            ]);
        } else{
            if($fonction === 'Chef de division'){
                $demande->VALIDDIV = 'Validé';
            }elseif($fonction === 'Chef de service'){
                $demande->VALIDCHEF = 'Validé';
                $joursADebiter = $request->input('joursADebiter');

            if (!empty($joursADebiter) && is_array($joursADebiter)) {
                foreach ($joursADebiter as $item) {
                    decision::create([
                        'id_conge_absence' => $id,
                        'congeDebite' => $item['jours'],
                        'an' => $item['annee'],
                    ]);
                }
            }
            } else{
                return response()->json(['message' => 'Role non autorisé'], 403);
            }

            $demande->save();

            if($fonction === 'Chef de division'){
                return response()->json([
                    'message' => 'Demande validée.',
                ]);
            }elseif($fonction === 'Chef de service'){
                return response()->json([
                    'message' => 'Demande validée et decision enregistrée.',
                ]);
            }        
        }
    }


    public function destroy(string $id) {}
}
