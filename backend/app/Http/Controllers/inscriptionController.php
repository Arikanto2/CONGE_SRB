<?php

namespace App\Http\Controllers;

use App\Models\Personnel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class inscriptionController extends Controller
{
    //
    public function store(Request $request) {
        $validated = $request->validate([
            'IM'=>['required', 'unique:personnel,IM'],
            'IM_Chef'=>['nullable', 'exists:personnel,IM'],
            'NOM'=>['required', 'string', 'max:68'],
            'PRENOMS'=>['nullable', 'string', 'max:128'],
            'EMAIL'=>['nullable', 'email', 'max:128', 'unique:personnel,EMAIL'],
            'CORPS'=>['required', 'string', 'max:64'],
            'GARDE'=>['required', 'string', 'max:64'],
            'FONCTION'=>['required', 'string', 'max:64'],
            'TEL'=>['nullable', 'string', 'max:32'],
            'PDP'=>['nullable', 'string', 'max:128'],
            'MDP'=>['required', 'string', 'min:8', 'confirmed'],
        ]);
        if(!empty($validated['MDP'])) {
            $validated['MDP'] = Hash::make($validated['MDP']);
        }
        $personnel = Personnel::create($validated);
        return response()->json([
            'message' => 'Inscription réussie',
            'personnel' => $personnel],201);   
    }
}
