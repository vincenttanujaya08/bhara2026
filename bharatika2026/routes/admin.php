<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;


Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'index'])->name('admin.dashboard');
    Route::get('/registrations', [AdminController::class, 'registrations'])->name('admin.registrations.index');
    Route::get('/registrations/{id}', [AdminController::class, 'showRegistration'])->name('admin.registrations.show');
    Route::post('/registrations/{id}/verify', [AdminController::class, 'verify'])->name('admin.registrations.verify');
});
