<?php

namespace App\Exceptions;

use Exception;

class AuthError extends Exception
{
    public function __construct($message = [], int $code = 401)
    {
        parent::__construct($message, $code);
    }
}
