<?php

namespace App\Http\Controllers;

use App\Models\Commerce;
use App\Models\Market;
use Error;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SearchController extends Controller
{
    public function searchEntidad($entidad)
    {
        try {
            $mercados = Market::searchMarkets($entidad);
            $comercios = Commerce::searchCommerces($entidad)->toArray();

            $comerciosWithImagenes = array_map(function ($comercio){
                $user = User::where('email', $comercio->email)->first();
                if ($user) {
                    // Obtén la URL de la foto de perfil
                    $comercio->foto_perfil = CommerceController::getProfileImageUrl($user->id);
                } else {
                    // Si el usuario no se encuentra, puedes asignar un valor predeterminado si lo deseas
                    $comercio->foto_perfil = null;
                }
                return $comercio;

            }, $comercios);


            return response()->json([
                'status' => true,
                'mercados' => $mercados,
                'comercios' => $comercios
            ], 200);

        } catch (Error $error) {
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $error->getCode() == 0 ? 400 : $error->getCode());
        }
    }
}
