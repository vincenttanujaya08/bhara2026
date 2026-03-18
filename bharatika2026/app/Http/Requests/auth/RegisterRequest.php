<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'instansi' => 'required|string|max:255',
            'whatsapp' => 'required|string|max:20',
            'line_id' => 'nullable|string|max:50',
            'password' => 'required|string|min:6|confirmed',
        ];
    }
}
