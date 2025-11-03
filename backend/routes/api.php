
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InscriptionController;
use App\Http\Controllers\AccueilController;
use App\Http\Controllers\StatsController;

Route::middleware(['cors'])->group(function () {
    // Routes publiques
    Route::post('/inscription', [InscriptionController::class, 'store']);
    Route::post('/login', [InscriptionController::class, 'login']);
    Route::post('/verify-chef-service', [InscriptionController::class, 'verifyChefService']);
    Route::post('/verify-chef-division', [InscriptionController::class, 'verifyChefDivision']);


    Route::resource('Accueil', AccueilController::class );
    Route::resource('Stats', StatsController::class);
    
    // Routes protégées par JWT
    Route::middleware(['auth:api'])->group(function () {
        Route::post('/logout', [InscriptionController::class, 'logout']);
        Route::get('/verify-token', [InscriptionController::class, 'verifyToken']);        
    });
});
