<?php

namespace App\Http\Controllers;

use App\Exceptions\ActionNotAuthorized;
use App\Exceptions\ValidationError;
use App\Models\Cart;
use App\Models\Commerce;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use Error;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Validator;
use Pusher\Pusher;

class OrderController extends Controller
{
    public function doPedido($cartToken)
    {
        try {
            $user = Auth::user();
            $customer = Customer::findCustomer($user->email);
            if ($customer) {
                $cartId = Crypt::decryptString($cartToken);
                $cartContent = Cart::getCart($cartId);
                $products = ProductController::getProductsWithQuantity($cartContent);

                // Agrupar productos por comercio
                $groupedProducts = [];
                foreach ($products as $product) {
                    $commerceId = $product->id_comercio;
                    if (!isset($groupedProducts[$commerceId])) {
                        $groupedProducts[$commerceId] = [];
                    }
                    foreach ($cartContent as $cartRow) {
                        if ($cartRow->id_producto == $product->id) {
                            $groupedProducts[$commerceId][] = [
                                'id_producto' => $product->id,
                                'precio_producto' => $product->precio,
                                'cantidad' => $cartRow->cantidad
                            ];
                        }
                    }
                }
                $orders = [];
                foreach ($groupedProducts as $commerceId => $group) {
                    $orders[] = Order::createOrder($commerceId, $customer->id, $group);
                }

                Cart::setInvisibleCart($cartId);
                $pusher = new Pusher(
                    env('PUSHER_APP_KEY'),
                    env('PUSHER_APP_SECRET'),
                    env('PUSHER_APP_ID'),
                    [
                        'cluster' => env('PUSHER_APP_CLUSTER'),
                        'useTLS' => true,
                    ]
                );

                // Emitir el evento 'nuevo-pedido' a un canal específico, por ejemplo, 'pedidos'
                $pusher->trigger('pedidos', 'nuevo-pedido', array_keys($groupedProducts));


                return response()->json([
                    'status' => true,
                    'message' => 'Pedidos realizados correctamente',
                    'data' => $orders
                ]);
            } else {
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

    public function cancelPedido($idOrder){
        try {
            $user = Auth::user();
            $cliente = Customer::findCustomer($user->email);
            $order = Order::findOrderByCustomer($idOrder,  $cliente->id);

            if ($order) {
                Order::changeStatus($order->id, 'cancelado');
                $pusher = new Pusher(
                    env('PUSHER_APP_KEY'),
                    env('PUSHER_APP_SECRET'),
                    env('PUSHER_APP_ID'),
                    [
                        'cluster' => env('PUSHER_APP_CLUSTER'),
                        'useTLS' => true,
                    ]
                );
                $pusher->trigger('estados', 'nuevo-estado', $order->id_cliente);

                return response()->json([
                    'status' => true,
                    'message' => 'Estado de pedido actualizado correctamente',
                    'pedido' => $order
                ], 200);
            } else {
                throw new ActionNotAuthorized;
            }
        } catch (ActionNotAuthorized $error) {
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $error->getCode() ?: 403); // Default to 403 if no code is set
        } catch (\Exception $error) { // Catch all other exceptions
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], 500); // Default to 500 for general errors
        }
    }

    public function getPedidosPendientes()
    {
        try {
            $user = Auth::user();
            $comercio = Commerce::findCommerce($user->email);

            if ($comercio) {
                $pedidos = Order::getPendingOrdersByCommerce($comercio->id);
                return response()->json([
                    'status' => true,
                    'pedidos' => $pedidos
                ], 200);
            } else {
                throw new ActionNotAuthorized('Usuario no autorizado', 403);
            }
        } catch (ActionNotAuthorized $error) {
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $error->getCode() ?: 403);
        } catch (\Exception $error) {
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], 500);
        }
    }

    public function getPedidosCliente(){
        try {
            $user = Auth::user();
            $cliente = Customer::findCustomer($user->email);
            if ($cliente) {
                $pedidos = Order::getPendingOrdersByCustomer($cliente->id);
                return response()->json([
                    'status' => true,
                    'pedidos' => $pedidos
                ], 200);
            } else {
                throw new ActionNotAuthorized('Usuario no autorizado', 403);
            }
        } catch (ActionNotAuthorized $error) {
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $error->getCode() ?: 403); // Default to 403 if no code is set
        } catch (\Exception $error) { // Catch all other exceptions
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], 500); // Default to 500 for general errors
        }
    }

    public function changeEstado($idOrder, $estado){
        try {
            $user = Auth::user();
            $comercio = Commerce::findCommerce($user->email);
            $order = Order::findOrder($idOrder, $comercio->id);

            if ($comercio && $order) {
                Order::changeStatus($order->id ,$estado);
                $order = Order::findOrder($idOrder, $comercio->id);

                $pusher = new Pusher(
                    env('PUSHER_APP_KEY'),
                    env('PUSHER_APP_SECRET'),
                    env('PUSHER_APP_ID'),
                    [
                        'cluster' => env('PUSHER_APP_CLUSTER'),
                        'useTLS' => false,
                    ]
                );

                // Emitir el evento 'nuevo-pedido' a un canal específico, por ejemplo, 'pedidos'
                $pusher->trigger('estados', 'nuevo-estado', $order->id_cliente);

                return response()->json([
                    'status' => true,
                    'message' => 'Estado de pedido actualizado correctamente',
                    'pedido' => $order
                ], 200);
            } else {
                throw new ActionNotAuthorized;
            }
        } catch (ActionNotAuthorized $error) {
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $error->getCode() ?: 403); // Default to 403 if no code is set
        } catch (\Exception $error) { // Catch all other exceptions
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], 500); // Default to 500 for general errors
        }
    }


}
