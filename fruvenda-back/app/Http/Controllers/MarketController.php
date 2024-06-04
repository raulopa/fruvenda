<?php

namespace App\Http\Controllers;

use App\Exceptions\ActionNotAuthorized;
use App\Models\Commerce;
use App\Models\Market;
use App\Models\Product;
use Error;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MarketController extends Controller
{
    public function searchMarketsByCp($cp)
    {
        try {
            $markets = Market::searchMarketByCp($cp);

            return response()->json([
                'status' => true,
                'markets' => $markets
            ], 200);
        } catch (Error $error) {
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $error->getCode());
        }
    }
    public function suscribedMarkets()
    {
        try {
            $user = Auth::user();
            $comercio = Commerce::findCommerce($user->email);
            if ($comercio) {
                $suscribedMarketsIds = Market::getSuscribedMarkets($comercio->id)->toArray();
                $suscribedMarketsIds = array_map(function($market) {
                    return $market->id_mercado;
                }, $suscribedMarketsIds);

                $markets = Market::searchSuscribedMarkets($suscribedMarketsIds);
                return response()->json([
                    'status' => true,
                    'markets' => $markets
                ], 200);
            } else {
                throw new ActionNotAuthorized('Comercio no autorizado', 403);
            }
        } catch (ActionNotAuthorized $error) {
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $error->getCode() ? $error->getCode() : 403);
        } catch (\Exception $error) {
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], 500);
        }
    }

    public function suscribeToMarket(Request $request)
    {
        try {
            $arrayId = $request->ids;
            $user = Auth::user();
            $comercio = Commerce::findCommerce($user->email);
            if ($comercio) {
                $suscribedMarkets = Market::getSuscribedMarkets($comercio->id)->toArray();
                $suscribedMarkets = array_map(function($market) {
                    return $market->id_mercado;
                }, $suscribedMarkets);

                foreach ($arrayId as $id) {
                    if (!in_array($id, $suscribedMarkets)) {
                        // Si el ID no está en los mercados suscritos, suscribir
                        Market::suscribeMarket($comercio->id, $id);
                    }
                }

                foreach ($suscribedMarkets as $id) {
                    if (!in_array($id, $arrayId)) {
                        // Si el ID no está en los IDs recibidos, desuscribir
                        Market::unsuscribeMarket($comercio->id, $id);
                    }
                }

                return response()->json([
                    'status' => true,
                    'message' => 'Mercados actualizados correctamente'
                ], 200);

            }else {
                throw new ActionNotAuthorized();
            }
        } catch (ActionNotAuthorized $error) {
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $error->getCode());
        } catch (Error $error) {
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $error->getCode());
        }
    }
}
