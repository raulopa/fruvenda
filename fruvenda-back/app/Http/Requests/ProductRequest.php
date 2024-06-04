<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductRequest extends FormRequest
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
            'nombre' => 'string|required|min:4',
            'precio' => 'numeric|required',
            'stock' => 'numeric|int|required',
            'ud_medida' => ['required', Rule::in('precio_kilo', 'unidades')],
        ];
    }

    public function messages()
    {
        return [
            'required' => 'El campo :attribute es requerido',
            'in' => 'La unidad de medida debe ser por precio/kilo o por unidad',
            'string' => 'El campo :attribute debe ser una cadena de texto',
            'numeric' => 'El campo :attribute debe ser un número'
        ];
    }
}
