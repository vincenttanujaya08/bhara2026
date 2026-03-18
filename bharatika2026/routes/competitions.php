<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CompetitionController;

Route::middleware('auth')->group(function () {
    Route::get('/competitions', [CompetitionController::class, 'index']);
    Route::get('/competitions/{id}/register', [CompetitionController::class, 'show']);
    Route::post('/competitions/{id}/register', [CompetitionController::class, 'store']);

    Route::get('/history', [CompetitionController::class, 'history']);
    Route::get('/history/{id}', [CompetitionController::class, 'showHistory']);
    Route::put('/history/{id}', [CompetitionController::class, 'updateHistory']);

    Route::post('/history/{id}/submit-work', [CompetitionController::class, 'submitWork']);
});
