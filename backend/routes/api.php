<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InscriptionController;

Route::apiResource('inscription', InscriptionController::class);
