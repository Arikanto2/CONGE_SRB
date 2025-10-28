
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InscriptionController;
use App\Http\Controllers\AccueilController;

Route::middleware(['cors'])->group(function () {
    // Routes publiques
    Route::post('/inscription', [InscriptionController::class, 'store']);
    Route::post('/login', [InscriptionController::class, 'login']);

    Route::resource('Accueil', AccueilController::class );

    // Routes protégées par JWT
    Route::middleware(['auth:api'])->group(function () {
        Route::post('/logout', [InscriptionController::class, 'logout']);
        Route::get('/verify-token', [InscriptionController::class, 'verifyToken']);
        Route::get('/user', [InscriptionController::class, 'getUser']);

    });
});
