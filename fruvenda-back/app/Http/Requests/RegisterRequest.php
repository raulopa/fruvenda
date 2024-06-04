<?php

namespace App\Http\Requests;

use App\Rules\PasswordValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nombre' => 'required',
            'email' => 'required|email|unique:users',
            'password' => ['required', 'min:8',new PasswordValidationRule() ],
            'password_confirmation' => ['required','same:password', new PasswordValidationRule()]
        ];
    }

    public function messages()
    {
        return [
            'required' => 'El campo :attribute es requerido',
            'email' => 'El campo :attribute debe ser un email válido',
            'unique' => 'El usuario ya existe',
            'same' => 'La contraseña no coincide'
        ];
    }
}
