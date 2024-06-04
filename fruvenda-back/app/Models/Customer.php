<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Customer extends Model
{
    use HasFactory;


    public static function createCustomer($registerData){
        $customerId= DB::table('clientes')->insertGetId($registerData);
        $customer = DB::table('clientes')->where('id', $customerId)->first();
        return $customer;
    }

    public static function findCustomer($email){
        return DB::table('clientes')->where('email', $email)->first();
    }
    public static function editCustomer(array $data)
    {
        DB::table('clientes')->where('id', $data['id'])->update($data);
        return self::findCustomer($data['email']);
    }

    public static function findCustomerById($id)
    {
        return DB::table('clientes')->where('id', $id)->first();
    }

    public static function getFollowedCommerce($idCliente, $idComercio)
    {
        $seguido = DB::table('seguidos_cliente_comercio')->where('id_cliente', $idCliente)->where('id_comercio', $idComercio)->first();
        if($seguido){
            return true;
        }else{
            return false;
        }
    }

    public static function setFollowedCommerce($idCliente, $idComercio)
    {
        return DB::table('seguidos_cliente_comercio')->insert([
            'id_comercio' => $idComercio,
            'id_cliente' => $idCliente
        ]);
    }

    public static function deleteFollowedCommerce($idCliente, $idComercio)
    {
        $delete =  DB::table('seguidos_cliente_comercio')->where('id_cliente', $idCliente)->where('id_comercio', $idComercio)->delete();
        if($delete > 0 ){
            return false;
        }else{
            return true;
        }
    }

    public static function getFollowedCommerces($idCliente)
    {
        return DB::table('seguidos_cliente_comercio')->where('id_cliente', $idCliente)->get();
    }


}
