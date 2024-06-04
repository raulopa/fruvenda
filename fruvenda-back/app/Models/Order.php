<?php

namespace App\Models;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Order extends Model
{
    use HasFactory;


    public static function createOrder($idComercio, $idCliente, $rows){
        $pedido = DB::table('pedidos')->insertGetId([
           'fecha_hora' => Carbon::now(),
           'estado' => 'procesado',
           'id_cliente' => $idCliente,
           'id_comercio' => $idComercio
        ]);
        foreach ($rows as $row){
            $row['id_pedido'] = $pedido;
            DB::table('lineas_pedido')->insertGetId($row);
        }
       return $pedido;
    }

    public static function getPendingOrdersByCommerce($idComercio)
    {
        // Obtener pedidos pendientes
        $pedidos = DB::table('pedidos')
            ->where('id_comercio', $idComercio)
            ->whereNotIn('estado', ['entregado', 'cancelado'])
            ->get();

        // Obtener las lineas de pedido
        $pedidos->each(function ($pedido) use ($idComercio) {
            $pedido->rows = DB::table('lineas_pedido')
                ->join('productos', 'lineas_pedido.id_producto', '=', 'productos.id')
                ->where('lineas_pedido.id_pedido', $pedido->id)
                ->select('lineas_pedido.*', 'productos.nombre', 'productos.ud_medida')
                ->get()->map(function ($linea) use ($idComercio) {
                    $linea->images = app('App\Http\Controllers\ProductController')->getProductImages($idComercio, $linea->id_producto);
                    return $linea;
                });
        });

        return $pedidos;
    }

    public static function findOrder($id, $idComercio)
    {
         $pedido = DB::table('pedidos')->where('id', $id)->where('id_comercio', $idComercio)->first();
            $pedido->rows = DB::table('lineas_pedido')
                ->join('productos', 'lineas_pedido.id_producto', '=', 'productos.id')
                ->where('lineas_pedido.id_pedido', $pedido->id)
                ->select('lineas_pedido.*', 'productos.nombre', 'productos.ud_medida')
                ->get()->map(function ($linea) use ($idComercio) {
                    $linea->images = app('App\Http\Controllers\ProductController')->getProductImages($idComercio, $linea->id_producto);
                    return $linea;
                });
        return $pedido;
    }

    public static function findOrderByCustomer($id, $idCliente)
    {
        $pedido = DB::table('pedidos')->where('id', $id)->where('id_cliente', $idCliente)->first();
        $pedido->rows = DB::table('lineas_pedido')
            ->join('productos', 'lineas_pedido.id_producto', '=', 'productos.id')
            ->where('lineas_pedido.id_pedido', $pedido->id)
            ->select('lineas_pedido.*', 'productos.nombre', 'productos.ud_medida')
            ->get()->map(function ($linea) use ($pedido) {
                $linea->images = app('App\Http\Controllers\ProductController')->getProductImages($pedido->id_comercio, $linea->id_producto);
                return $linea;
            });
        return $pedido;
    }

    public static function changeStatus($id, $status){
        return DB::table('pedidos')->where('id', $id)->update(['estado' => $status]);
    }

    public static function getPendingOrdersByCustomer($idCliente)
    {
        // Obtener pedidos pendientes
        $pedidos = DB::table('pedidos')
            ->where('id_cliente', $idCliente) // Asegúrate de que esta columna exista
            ->whereNotIn('estado', ['entregado', 'cancelado'])
            ->get();

        // Obtener las lineas de pedido
        $pedidos->each(function ($pedido) {
            $pedido->rows = DB::table('lineas_pedido')
                ->join('productos', 'lineas_pedido.id_producto', '=', 'productos.id')
                ->where('lineas_pedido.id_pedido', $pedido->id)
                ->select('lineas_pedido.*', 'productos.nombre', 'productos.ud_medida')
                ->get()->map(function ($linea) use ($pedido) {
                    $linea->images = app('App\Http\Controllers\ProductController')->getProductImages($pedido->id_comercio, $linea->id_producto);
                    return $linea;
                });
        });

        return $pedidos;
    }

    public static function findOrderForCancellation($idOrder, $idComercio, $idCliente)
    {
        if($idComercio == null){
            return DB::table('pedidos')->where('id', $idOrder)->where('id_comercio', $idComercio)->first();
        }else if($idCliente == null){
            return DB::table('pedidos')->where('id', $idOrder)->where('id_comercio', $idCliente)->first();
        }

        return null;
    }


}
