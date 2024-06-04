<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CustomerEditRequest extends FormRequest
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
            'nombre' => 'required|string',
            'apellidos' => 'required|string',
            'telefono' => 'required|string|min:9',
        ];
    }
    public function messages()
    {
        return [
            'required' => 'El campo :attribute es requerido',
            'telefono.min' => 'El teléfono debe tener mínimo 9 carácteres',
            'email' => 'El email debe ser válido'
        ];
    }




}
