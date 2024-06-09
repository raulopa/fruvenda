<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Product extends Model
{
    use HasFactory;

    public static function getByCommerceId($email)
    {
        $comercio = DB::table('comercios')->where('email', $email)->first();
        $products = DB::table('productos')->where('id_comercio', $comercio->id)->where('borrado', 0)->get();
        return $products;
    }

    public static function getByCommerceIdForCustomer($id){
        $products = DB::table('productos')->where('id_comercio', $id)->where('visible', 1)->where('stock', '>', 0)->where('borrado', 0)->get();
        return $products;
    }

    public static function addProduct($data){

        $productId = DB::table('productos')->insertGetId($data);
        $product = Db::table('productos')->where('id', $productId)->first();
        return $product;
    }

    public static function deleteProduct($id){
        return DB::table('productos')->where('id', $id)->update(['borrado' => 1]);
    }

    public static function findProduct($id){
        return DB::table('productos')->where('id', $id)->first();
    }

    public static function editProduct($data){
        $producto = DB::table('productos')->where('id', $data['id'])->update($data);
        return self::findProduct($data['id']);
    }

    public static function getProducts($productsId)
    {
        return DB::table('productos')->whereIn('id', $productsId)->get();
    }

    public static function getProduct($id)
    {
        return DB::table('productos')->where('id', $id)->first();
    }

    public static function subtractStock($item)
    {
        DB::table('productos')
            ->where('id', $item['id_producto'])
            ->decrement('stock', $item['cantidad']);
    }
}
