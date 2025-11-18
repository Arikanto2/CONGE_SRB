
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InscriptionController;
use App\Http\Controllers\ProfilController;
use App\Http\Controllers\AccueilController;
use App\Http\Controllers\StatsController;

Route::middleware(['cors'])->group(function () {
    // Routes publiques
    Route::post('/inscription', [InscriptionController::class, 'store']);
    Route::post('/login', [InscriptionController::class, 'login']);
    Route::post('/verify-chef-service', [InscriptionController::class, 'verifyChefService']);
    Route::post('/verify-chef-division', [InscriptionController::class, 'verifyChefDivision']);
    Route::post('/creat-conge-annuel', [ProfilController::class, 'createCongeAnnuel']);


    Route::resource('Accueil', AccueilController::class );
    Route::resource('Stats', StatsController::class);
    
    // Routes protégées par JWT
    Route::middleware(['jwt.auth'])->group(function () {
        Route::post('/logout', [InscriptionController::class, 'logout']);

        Route::post('/modification', [InscriptionController::class, 'modification']);
        Route::post('/change-password', [InscriptionController::class, 'changeMDP']);
        Route::post('/verify-password', [InscriptionController::class, 'verifyMDP']);
        Route::get('/conge-annuel', [ProfilController::class, 'getCongeAnnuel']);
        Route::post('/faire-demande', [ProfilController::class, 'faireDemande']);
        Route::get('/solde/{id}', [ProfilController::class, 'getSolde']);
        Route::get('/all-demande/{id}', [ProfilController::class, 'getAlldemande']);
        Route::get('/decision/{id}', [ProfilController::class, 'getDecision']);
        
    });
});
