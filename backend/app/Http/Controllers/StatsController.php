<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class StatsController extends Controller
{
    public function index(Request $request)
    {
        $rows = DB::table('conge_absence')
            ->join('personnel', 'conge_absence.IM', '=', 'personnel.IM')
            ->select(
                'conge_absence.id',
                'personnel.NOM',
                'personnel.PRENOM',
                'conge_absence.CATEGORIE',
                'conge_absence.DATEDEBUT',
                'conge_absence.DATEFIN'
            )
            ->orderBy('conge_absence.DATEDEBUT', 'asc')
            ->get();

        $tasks = $rows->map(function($r) {
            $name = trim(($r->NOM ?? '') . ' ' . ($r->PRENOMS ?? ''));

            $start = $r->DATEDEBUT ? Carbon::parse($r->DATEDEBUT)->format('Y-m-d') : null;
            $end   = $r->DATEFIN ? Carbon::parse($r->DATEFIN)->format('Y-m-d') : null;

            $status = strtolower($r->CATEGORIE);

            return [
                'id'    => $r->id,
                'name'  => $name,
                'start' => $start,
                'end'   => $end,
                'status'=> $status,
            ];
        });
        return response()->json($tasks);
    }
}
