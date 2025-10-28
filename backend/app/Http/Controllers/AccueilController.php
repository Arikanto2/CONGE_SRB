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
