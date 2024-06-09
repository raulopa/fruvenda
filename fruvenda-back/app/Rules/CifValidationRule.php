<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class CifValidationRule implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $controlArray = ['J', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
        $cif = strtoupper($value);
        $lastChar = substr($cif, -1);

        $intConv = function ($valor) {
            return intval($valor);
        };

        if (preg_match('/^(([ABCDEFGHJNPQRSUVW]{1})([0-9]{7})([A-Z0-9]{1}))$/', $cif)) {


            $cifArray = str_split($cif);

            $oddSum = 0;
            $evenPart = [];


            for ($i = 1; $i < count($cifArray) - 1; $i++) {
                if (is_numeric($cifArray[$i])) {
                    if ($i % 2 == 0) {
                        $oddSum += $cifArray[$i];
                    } else {
                        $evenOp = $cifArray[$i] * 2 . "";
                        $evenOp = array_sum(array_map($intConv, str_split($evenOp)));
                        array_push($evenPart, $evenOp);
                    }
                } else {
                    $fail('CIF con formato incorrecto');
                }
            }
            $result = str_split($oddSum + array_sum($evenPart) . "");
            $units = end($result);


            if ($units == 0) {
                if (is_numeric($lastChar)) {
                    if ($units != $lastChar) {
                        $fail(json_encode($cifArray));
                    }
                } else {
                    if ($controlArray[$units] != $lastChar) {
                        $fail('El CIF proporcionado no es correcto2');
                    }
                }
            } else {
                $controlDigit = 10 - $units;
                if (is_numeric($lastChar)) {
                    if ($controlDigit != $lastChar) {
                        $fail($units . '--' . $lastChar);
                    }
                } else {
                    if ($controlArray[$controlDigit] != $lastChar) {
                        $fail('El CIF proporcionado no es correcto4');
                    }
                }
            }


        } else if (preg_match('/^([0-9]{8})([A-Z])$/i', $cif)) {
            $dni = strtoupper($value);
            $dni = strtoupper($value);
            $number = substr($dni, 0, 8);
            $expectedLetter = substr($dni, -1);
            $letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
            $letter = $letters[$number % 23];

            if ($letter !== $expectedLetter) {
                $fail('El DNI proporcionado no es válido');
            }
        } else {
            $fail('CIF o NIF con estructura incorrecta');
        }
    }


}
