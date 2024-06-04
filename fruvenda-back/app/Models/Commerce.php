<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Commerce extends Model
{
    use HasFactory;


    public static function createCommerce($registerData)
    {
        $commerceId = DB::table('comercios')->insertGetId($registerData);
        $commerce = DB::table('comercios')->where('id', $commerceId)->first();
        return $commerce;
    }

    public static function createSlug($id, $slug){
        $commerce = DB::table('comercios')->where('id', $id)->update(['slug' => $slug]);
        return $commerce;
    }

    public static function findCommerce($email)
    {
        return DB::table('comercios')->where('email', $email)->first();
    }

    public static function editCommerce(array $data)
    {
        $comercio = DB::table('comercios')->where('id', $data['id'])->update($data);
        return self::findCommerce($data['email']);
    }

    public static function deleteCommerce($id)
    {
        $comercioEliminado = DB::table('comercios')->where('id', $id)->update(['activo' => 0]);
        if ($comercioEliminado == 0) {
            return false;
        }
        return true;
    }

    public static function updateCommerceRating($idComercio, $valoracion){
        DB::table('comercios')->where('id', $idComercio)->update(['rating' => $valoracion]);
    }

    public static function findCommerceBySlug($slug)
    {
        return DB::table('comercios')->where('slug', $slug)->first();
    }

    public static function findCommerceById($id)
    {
        return DB::table('comercios')->where('id', $id)->first();
    }
}
