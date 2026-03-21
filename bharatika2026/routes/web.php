<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Category;
use App\Models\Competition;

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

require __DIR__ . '/auth.php';
require __DIR__ . '/admin.php';
require __DIR__ . '/competitions.php';