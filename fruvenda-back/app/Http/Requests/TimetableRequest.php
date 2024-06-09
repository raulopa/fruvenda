<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TimetableRequest extends FormRequest
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
            'timetable' => 'required|array',
            'timetable.*.value' => 'required|string', // Asegurarse de que el valor es una cadena
            'timetable.*.day' => 'required|string', // Asegurarse de que el día es una cadena
            'timetable.*.apertura' => 'string', // Apertura es requerida y debe ser una cadena
            'timetable.*.cierre' => 'string', // Cierre es requerido y debe ser una cadena
            'timetable.*.aviso' => 'nullable|string', // Aviso debe ser una cadena (opcional)
            'timetable.*.festivo' => 'required|boolean', // Festivo es requerido y debe ser booleano
        ];
    }
    public function messages(): array
    {
        return [
            'timetable.required' => 'Debes proporcionar un horario.',
            'timetable.array' => 'El horario debe ser una lista de días.',
            'timetable.*.value.required' => 'Cada día en el horario debe tener un valor único.',
            'timetable.*.value.string' => 'El valor de cada día debe ser texto.',
            'timetable.*.day.required' => 'Cada día en el horario debe tener un nombre.',
            'timetable.*.day.string' => 'El nombre de cada día debe ser texto.',
            'timetable.*.aviso.string' => 'El aviso debe ser texto si está presente.',
            'timetable.*.festivo.required' => 'Debes indicar si cada día es festivo o no.',
            'timetable.*.festivo.boolean' => 'El valor festivo debe ser verdadero o falso'
        ];
    }

}
