<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Review extends Model
{
    use HasFactory;


    public static function getReviewsCommerce($idCommerce)
    {
        return DB::table('resenas')->where('id_comercio', $idCommerce)->where('visible', 1)->get();
    }

    public static function findReviewByCustomerCommerce($idComercio, $idCliente)
    {
        return DB::table('resenas')->where('id_comercio', $idComercio)->where('id_cliente', $idCliente)->where('visible', 1)->first();
    }


    public static function createReview($resena)
    {
        $resenaId = DB::table('resenas')->insertGetId($resena);
        $valoracionComercio = DB::table('resenas')->where('id_comercio', $resena['id_comercio'])->where('visible', 1)->avg('valoracion');
        Commerce::updateCommerceRating($resena['id_comercio'], (int)$valoracionComercio);
        return DB::table('resenas')->where('id', $resenaId)->first();
    }

    public static function getReviewsCustomer($idCliente)
    {
        return DB::table('resenas')->where('id_cliente', $idCliente)->where('visible', 1)->get();
    }

    public static function deleteReview($idResena)
    {
        DB::table('resenas')->where('id', $idResena)->update(['visible'=> 0]);
    }

    public static function findReviewByCustomer($idCliente)
    {
        return DB::table('resenas')->where('id_cliente', $idCliente)->first();
    }
}
