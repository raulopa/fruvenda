<?php

namespace App\Http\Controllers;

use App\Exceptions\ActionNotAuthorized;
use App\Exceptions\ValidationError;
use App\Mail\MailCreatedOrder;
use App\Mail\StatusChangedMail;
use App\Models\Cart;
use App\Models\Commerce;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use Error;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
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
                    $order = Order::createOrder($commerceId, $customer->id, $group, $customer->nombre, $customer->telefono);
                    $orders[] = $order;

                    // Restar la cantidad comprada del stock de cada producto usando el DB Builder
                    foreach ($group as $item) {
                        Product::subtractStock($item);
                    }
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

                Mail::to($customer->email)->send(new MailCreatedOrder());
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

    public function takePedido(Request $request)
    {
    try {
        $user = Auth::user();
        $comercio = Commerce::findCommerce($user->email);
        if ($comercio) {
            $order = Order::createOrder($comercio->id, null, $request->lineas, $request->nombreCliente, $request->telefonoCliente);

            foreach ($request->lineas as $item) {
                Product::subtractStock($item);
            }

            return response()->json([
                'status' => true,
                'message' => 'Pedido realizado correctamente',
                'data' => $order
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

    public function cancelPedido($idOrder)
    {
        try {
            $user = Auth::user();
            $cliente = Customer::findCustomer($user->email);
            $order = Order::findOrderByCustomer($idOrder, $cliente->id);

            if ($order) {
                Order::changeStatus($order->id, 'cancelado');
                $orderLines = DB::table('lineas_pedido')
                    ->where('id_pedido', $idOrder)
                    ->get();

                foreach ($orderLines as $orderLine) {
                    $product = DB::table('productos')
                        ->where('id', $orderLine->id_producto)
                        ->first();
                    if ($product) {
                        $newStock = $product->stock + $orderLine->cantidad;
                        DB::table('productos')
                            ->where('id', $product->id)
                            ->update(['stock' => $newStock]);
                    }
                }

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

                $customer = Customer::findCustomerById($order->id_cliente);
                if($customer){
                    Mail::to($customer->email)->send(new StatusChangedMail('cancelado'));
                }

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

    public function getPedidos()
    {
        try {
            $user = Auth::user();
            $comercio = Commerce::findCommerce($user->email);

            if ($comercio) {
                $pedidos = Order::getOrdersByCommerce($comercio->id);
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

    public function getPedidosPendientesCliente()
    {
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

    public function getPedidosCliente()
    {
        try {
            $user = Auth::user();
            $cliente = Customer::findCustomer($user->email);
            if ($cliente) {
                $pedidos = Order::getOrdersByCustomer($cliente->id);
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

    public function changeEstado($idOrder, $estado)
    {
        try {
            $user = Auth::user();
            $comercio = Commerce::findCommerce($user->email);
            $order = Order::findOrder($idOrder, $comercio->id);

            if ($comercio && $order) {
                Order::changeStatus($order->id, $estado);
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
                $customer = Customer::findCustomerById($order->id_cliente);
                if($customer){
                    Mail::to($customer->email)->send(new StatusChangedMail($estado));
                }

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
