<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Customer;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Error;

class CartController extends Controller
{

    public function getCarrito($cartToken){
        try{
            $cartId = Crypt::decryptString($cartToken);
            $cartContent = Cart::getCart($cartId);
            $products = ProductController::getProductsWithQuantity($cartContent);
            $subtotal = $products->reduce(function ($carry, $producto) {
                return $carry + ($producto->precio * $producto->cantidad);
            }, 0);

            if($cartContent){
                return response()->json([
                    'status' => true,
                    'content' => $products,
                    'subtotal' => $subtotal
                ]);
            }else{
                throw new Error('El carrito está vacío', 500);
            }
        }catch(Error $error){
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $error->getCode() == 0 ? 400 : $error->getCode());
        }
    }

    public function deleteFilaCarrito($cartToken, $rowId){
        try{
            $cartId = Crypt::decryptString($cartToken);

            if($cartId){
                $length = Cart::deleteCart($cartId, $rowId);
                $cartContent = Cart::getCart($cartId);
                $products = ProductController::getProductsWithQuantity($cartContent);
                $subtotal = $products->reduce(function ($carry, $producto) {
                    return $carry + ($producto->precio * $producto->cantidad);
                }, 0);
                return response()->json([
                    'status' => true,
                    'message' => 'Producto eliminado correctamente',
                    'length' => $length,
                    'subtotal' => $subtotal
                ]);
            }else{
                throw new Error('El carrito está vacío', 500);
            }
        }catch(Error $error){
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $error->getCode() == 0 ? 400 : $error->getCode());
        }
    }

    private function createCarrito(Request $request){
        $user = $this->getUserFromRequest($request);
        $userId = $user ? Customer::findCustomer($user->email)->id : null;
        $carritoId = Cart::createCart($userId);
        $token = Crypt::encryptString($carritoId);
        return $token;
    }

    public function addToCarrito(Request $request){
        try{
            if(!$request->cartToken){
                $cartToken = $this->createCarrito($request);
            }else{
                $cartToken = $request->cartToken;
            }
            $cartId = Crypt::decryptString($cartToken);
            $cartLine = $request->only(['id', 'cantidad']);

            $cartContent = Cart::addProductToCart($cartId,$cartLine);


            if($cartContent){
                return response()->json([
                    'status' => true,
                    'cartToken' => $cartToken,
                    'message' => 'Producto añadido correctamente',
                    'content' => $cartContent
                ]);
            }else{
                throw new Error('El producto no se ha añadido', 500);
            }
        }catch(Error $error){
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $error->getCode() == 0 ? 400 : $error->getCode());
        }
    }

    private function getUserFromRequest(Request $request)
    {
        $token = $request->bearerToken();
        if ($token) {
            $user = Auth::guard('sanctum')->user();
            return $user;
        }
        return null;
    }
}
