<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Services\Auth\RegisterService;

class RegisterController extends Controller
{
    public function index()
    {
        return view('auth.register.index');
    }

    public function store(RegisterRequest $request, RegisterService $service)
    {
        $service->handle($request->validated());

        return redirect('/login')->with('success', 'Account created successfully!');
    }
}
