<?php

namespace App\Exceptions;

use Exception;

class ActionNotAuthorized extends Exception
{
    protected $message = 'No estás autorizado a realizar esta acción';
    protected $code = 401;
}
