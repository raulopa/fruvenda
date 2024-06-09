<?php

namespace App\Http\Controllers;

use App\Exceptions\ActionNotAuthorized;
use App\Exceptions\ValidationError;
use App\Http\Requests\TimetableRequest;
use App\Models\Commerce;
use App\Models\Timetable;
use Error;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Ramsey\Uuid\Type\Time;

class TimetableController extends Controller
{
    public function saveHorario(Request $request)
    {
        try {
            $user = Auth::user();
            $comercio = Commerce::findCommerce($user->email);
            if ($comercio) {
                Timetable::removeTimetables($request->input('mercado'), $comercio->id);
                Timetable::saveTimetables($request->all(),$comercio->id);
                return response()->json([
                    'status' => true,
                    'horarios' => true
                ], 200);
            } else {
                throw new ActionNotAuthorized();
            }
        } catch (ActionNotAuthorized|ValidationError $error) {
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $error->getCode());
        } catch (Error $error) {
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $error->getCode() == 0 ? 400 : $error->getCode());
        }
    }

    public function getHorario()
    {
        try {
            $user = Auth::user();
            $comercio = Commerce::findCommerce($user->email);
            if ($comercio) {
                $horarios = Timetable::getTimetables($comercio->id);
                return response()->json([
                    'status' => true,
                    'horarios' => $horarios
                ], 200);
            } else {
                throw new ActionNotAuthorized();
            }
        } catch (ActionNotAuthorized|ValidationError $error) {
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $error->getCode());
        } catch (Error $error) {
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $error->getCode() == 0 ? 400 : $error->getCode());
        }
    }
}
