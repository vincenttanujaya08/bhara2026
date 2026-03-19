<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Services\Auth\RegisterService;
use Inertia\Inertia;

class RegisterController extends Controller
{
    public function index()
    {
        return Inertia::render('Auth/Register');
    }

    public function store(RegisterRequest $request, RegisterService $service)
    {
        $service->handle($request->validated());
        return redirect('/login')->with('success', 'Akun berhasil dibuat! Silakan login.');
    }
}