<?php

namespace App\Http\Controllers;

use App\Models\Demande;
use App\Models\Personnel;
use Illuminate\Http\Request;

class AccueilController extends Controller
{

    public function index()
    {
        $im = 311427;
        $personnel = Personnel::where('IM', 311427)->first();

        //             if ($personnel) {
        //                 return response()->json([
        //                     'nom' => $personnel->NOM,
        //                 ]);
        //             }
        //             return response()->json([
        //                 'nom' => null,
        //                 'error' => 'Personnel non trouvé'
        //             ], 404);

        $dernieresDemandes = Demande::where('IM', 311427)
            ->orderBy('DATEDEBUT', 'desc')
            ->limit(3)
            ->get(['DATEDEBUT', 'DATEFIN', 'VALIDCHEF']);

        return response()->json([
            'nom' => $personnel->NOM,
            'dernieres_demandes' => $dernieresDemandes
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
            if ($nb_jour > 0) {
                return response()->json(['message' => 'Demande créée, mais congé annuel insuffisant. Il reste ' . $nb_jour . ' jour(s) non couvert(s).'], 201);
            }
                
*/
    }

    public function store(Request $request) {}


    public function show(string $id) {}


    public function edit(string $id) {}


    public function update(Request $request, string $id) {}


    public function destroy(string $id) {}
}
