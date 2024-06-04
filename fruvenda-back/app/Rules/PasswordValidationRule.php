<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class PasswordValidationRule implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $expresiones = [
            'mayuscula' => '/[A-Z]/',
            'minuscula' => '/[a-z]/',
            'numero' => '/\d/',
            'especial' => '/[!@#$%^&*(),.?":{}|<>]/'
        ];

        foreach ($expresiones as $expresion) {
            if (!preg_match($expresion, $value)) {
                $fail('La contraseña no cumple con los requisitos de seguridad');
            }
        }

        if (strlen($value) < 8) {
            $fail('La contraseña debe tener mínimo 8 carácteres.');
        }
    }
}
