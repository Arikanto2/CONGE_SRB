<?php

namespace App\Http\Controllers;

use App\Models\Conge_annuel;
use App\Models\Demande;
use App\Models\Personnel;
use Illuminate\Http\Request;
class AccueilController extends Controller
{
    public function index()
        {
            $im = 311427;
            $personnel = Personnel::where('IM', $im)->first();

            if (!$personnel) {
                    return response()->json([
                        'nom' => null,
                        'error' => 'Personnel non trouvé'
                    ], 404);
            }

            $dernieresDemandes = Demande::where('IM', $im)
                   ->orderBy('DATEDEBUT', 'desc')
                   ->limit(3)
                   ->get(['DATEDEBUT', 'DATEFIN', 'VALIDCHEF']);

            $Total_conge = Conge_annuel::where('IM', $im)->sum('NBR_CONGE');


            return response()->json([
                  'nom' => $personnel->NOM,
                  'dernieres_demandes' => $dernieresDemandes,
                  'nbr_Conge' => $Total_conge
                ]);
        }

    public function create()
    {

    }

    public function store(Request $request)
    {

    }


    public function show(string $id)
    {

    }


    public function edit(string $id)
    {

    }


    public function update(Request $request, string $id)
    {

    }


    public function destroy(string $id)
    {

    }
}
