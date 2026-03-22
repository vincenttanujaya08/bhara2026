<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Category;
use App\Models\Competition;
use App\Http\Controllers\ProfileController;

Route::get('/', function () {
    return Inertia::render('Home', [
        'categories'   => Category::with('competitions')->get(),
        'competitions' => Competition::with('category')->get(),
    ]);
});

Route::get('/about', function () {
    return Inertia::render('About');
});

Route::get('/events', fn() => inertia('Events'))->name('events');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'index'])->name('profile');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password');
});

require __DIR__ . '/auth.php';
require __DIR__ . '/admin.php';
require __DIR__ . '/competitions.php';