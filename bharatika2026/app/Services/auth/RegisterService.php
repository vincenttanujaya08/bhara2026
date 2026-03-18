<?php

namespace App\Services\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RegisterService
{
    public function handle(array $data): User
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'instansi' => $data['instansi'],
            'whatsapp' => $data['whatsapp'],
            'line_id' => $data['line_id'] ?? null,
            'password' => Hash::make($data['password']),
        ]);
    }
}
