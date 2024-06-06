<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Market extends Model
{
    use HasFactory;

    public static function searchMarketByCp($cp){
        return DB::table('mercados')->where('codigo_postal', 'LIKE', '%'.$cp.'%')->get();
    }

    public static function getSuscribedMarkets($id)
    {
        return DB::table('lista_comercio_mercado')->where('id_comercio', $id)->get(['id_mercado']);
    }

    public static function unsuscribeMarket($idCommerce, $idMarket)
    {
        return DB::table('lista_comercio_mercado')->where('id_comercio', $idCommerce)->where('id_mercado', $idMarket)->delete();
    }

    public static function suscribeMarket($idCommerce, $idMarket)
    {
        return DB::table('lista_comercio_mercado')->insert(['id_comercio' => $idCommerce, 'id_mercado' => $idMarket]);
    }

    public static function searchSuscribedMarkets($suscribedMarketsIds)
    {
        return DB::table('mercados')->whereIn('id', $suscribedMarketsIds)->get();
    }

    public static function getMarkets()
    {
        return DB::table('mercados')->get();
    }

    public static function getMarketBySlug($slug)
    {
        return DB::table('mercados')->where('slug', $slug)->first();
    }

    public static function searchMarkets($entidad)
    {
        return DB::table('mercados')
            ->where('nombre', 'LIKE', '%' . $entidad . '%')
            ->orWhere('codigo_postal', 'LIKE', '%' . $entidad . '%')
            ->orWhere('direccion', 'LIKE', '%' . $entidad . '%')
            ->orWhere('slug', 'LIKE', '%' . $entidad . '%')
            ->get();
    }
}
