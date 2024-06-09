<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Timetable extends Model
{
    use HasFactory;


    public static function saveTimetables($array, $idCommerce)
    {
        $mercado = isset($array['mercado']) && $array['mercado'] !== '' ? $array['mercado'] : null;
        foreach ($array['timetable'] as $item) {
            $apertura = isset($item['apertura']) && $item['apertura'] !== '' ? $item['apertura'] : null;
            $cierre = isset($item['cierre']) && $item['cierre'] !== '' ? $item['cierre'] : null;

            DB::table('horario')->insert([
                'apertura' => $apertura,
                'cierre' => $cierre,
                'festivo' => $item['festivo'],
                'aviso' => $item['aviso'],
                'dia_semana' => $item['value'],
                'id_comercio' => $idCommerce,
                'id_mercado' => $mercado
            ]);
        }
    }

    public static function removeTimetables($mercado, $comercio)
    {
        DB::table('horario')->where('id_mercado', $mercado)->where('id_comercio', $comercio)->delete();
    }

    public static function getTimetables($comercio)
    {
        $horarios = [];

        // Obtenemos todos los horarios del comercio
        $todosHorarios = DB::table('horario')
            ->where('id_comercio', $comercio)
            ->get();

        // Iteramos sobre los horarios y los agrupamos por id_mercado
        foreach ($todosHorarios as $horario) {
            $id_mercado = $horario->id_mercado;

            // Si no existe un array para este id_mercado, lo creamos
            if (!isset($horarios[$id_mercado])) {
                $horarios[$id_mercado] = [];
            }

            // Añadimos el horario al array correspondiente al id_mercado
            $horarios[$id_mercado][] = $horario;
        }

        // Convertimos el array a un array numérico
        return array_values($horarios);
    }

}
