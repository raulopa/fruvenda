<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReviewRequest extends FormRequest
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
            'titulo' => 'required|string|max:128',
            'cuerpo' => 'required|string|max:255',
            'valoracion' => 'required|integer|min:1|max:5',
        ];
    }

    /**
     * Get custom error messages for specific rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'titulo.required' => 'El título es obligatorio.',
            'titulo.string' => 'El título debe ser una cadena de texto.',
            'titulo.max' => 'El título no debe superar los 128 caracteres.',
            'cuerpo.required' => 'El cuerpo es obligatorio.',
            'cuerpo.string' => 'El cuerpo debe ser una cadena de texto.',
            'cuerpo.max' => 'El cuerpo no debe superar los 255 caracteres.',
            'valoracion.required' => 'La valoración es obligatoria.',
            'valoracion.integer' => 'La valoración debe ser un número entero.',
            'valoracion.min' => 'La valoración mínima es de 1 estrella.',
            'valoracion.max' => 'La valoración máxima es de 5 estrellas.',
        ];
    }
}
