
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InscriptionController;
use App\Http\Controllers\ProfilController;
use App\Http\Controllers\AccueilController;

Route::middleware(['cors'])->group(function () {
    // Routes publiques
    Route::post('/inscription', [InscriptionController::class, 'store']);
    Route::post('/login', [InscriptionController::class, 'login']);
    Route::post('/verify-chef-service', [InscriptionController::class, 'verifyChefService']);
    Route::post('/verify-chef-division', [InscriptionController::class, 'verifyChefDivision']);


    Route::resource('Accueil', AccueilController::class);

    // Route de test pour vérifier l'API sans JWT
    Route::get('/test-conge', [ProfilController::class, 'testCongeAnnuel']);

    // Routes protégées par JWT
    Route::middleware(['jwt.auth'])->group(function () {
        Route::post('/logout', [InscriptionController::class, 'logout']);
        Route::post('/modification', [InscriptionController::class, 'modification']);
        Route::post('/change-password', [InscriptionController::class, 'changeMDP']);
        Route::post('/verify-password', [InscriptionController::class, 'verifyMDP']);
        Route::get('/conge-annuel', [ProfilController::class, 'getCongeAnnuel']);
        Route::post('/faire-demande', [ProfilController::class, 'faireDemande']);
    });
});
