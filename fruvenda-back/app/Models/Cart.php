<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Cart extends Model
{
    use HasFactory;

    public static function createCart($userId){
        $cartId = DB::table('carritos')->insertGetId(['id_cliente' => $userId]);
        return $cartId;
    }

    public static function getCart($cartId){
        return DB::table('lineas_carrito')->where('id_carrito', $cartId)->get();
    }

    public static function findCart($id)
    {
        return DB::table('carritos')->where('id', $id)->first();
    }

    public static function findCartWithCustomer($id)
    {
        return DB::table('carritos')->where('id_cliente', $id)->where('activo', 1)->first();
    }

    public static function addProductToCart($cartId, $cartLine) {
        $existingCartLine = DB::table('lineas_carrito')
            ->where('id_carrito', $cartId)
            ->where('id_producto', $cartLine['id'])
            ->first();

        if ($existingCartLine) {
            DB::table('lineas_carrito')
                ->where('id_carrito', $cartId)
                ->where('id_producto', $cartLine['id'])
                ->update([
                    'cantidad' => $existingCartLine->cantidad + $cartLine['cantidad']
                ]);
        } else {
            DB::table('lineas_carrito')->insert([
                'id_carrito' => $cartId,
                'id_producto' => $cartLine['id'],
                'cantidad' => $cartLine['cantidad']
            ]);
        }
        $cartContent = DB::table('lineas_carrito')->where('id_carrito', $cartId)->get();

        return $cartContent;
    }

    public static function deleteCart(string $cartId, $rowId)
    {
        DB::table('lineas_carrito')->where('id_carrito', $cartId)->where('id', $rowId)->delete();
        return DB::table('lineas_carrito')->where('id_carrito', $cartId)->count();
    }

    public static function setInvisibleCart(string $cartId)
    {
        DB::table('carritos')->where('id', $cartId)->update(['activo' => 0]);
    }


}
