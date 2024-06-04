<?php

namespace App\Exceptions;

use Exception;

class ValidationError extends Exception
{
    public function __construct($message = [], int $code = 0)
    {
        parent::__construct($message, $code);
    }
}
