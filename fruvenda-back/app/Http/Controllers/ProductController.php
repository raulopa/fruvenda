<?php

namespace App\Http\Controllers;

use App\Exceptions\ActionNotAuthorized;
use App\Exceptions\ValidationError;
use App\Http\Requests\ProductRequest;
use App\Models\Commerce;
use App\Models\Product;
use Error;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;


class ProductController extends Controller
{
    public static function getProductsWithQuantity($cartContent)
    {
        $productsId = $cartContent->map(function($linea){
            return $linea->id_producto;
        });

        $products = Product::getProducts($productsId);
        if($products){
            foreach ($products as $product){
                $images = ProductController::getProductImages($product->id_comercio, $product->id);
                $product->images = $images;
                foreach ($cartContent as $linea){
                    if($product->id == $linea->id_producto){
                        $product->cantidad = $linea->cantidad;
                        $product->rowId = $linea->id;
                        break;
                    }
                }
            }
            return $products;
        }
        return [];
    }

    public function getProductosComercio()
    {
        try {
            $user = Auth::user();
            $comercio = Commerce::findCommerce($user->email);

            if (!$comercio) {
                return response()->json([
                    'status' => false,
                    'message' => 'Comercio no encontrado.'
                ], 404);
            }

            $products = Product::getByCommerceId($comercio->email);

            if ($products->isEmpty()) {
                return response()->json([
                    'status' => true,
                    'message' => 'El comercio seleccionado no tiene productos'
                ]);
            }

            $products->transform(function ($product) use ($comercio) {
                $product->images = self::getProductImages($comercio->id, $product->id);
                return $product;
            });

            return response()->json([
                'status' => true,
                'products' => $products
            ]);
        } catch (\Exception $error) {
            return response()->json([
                'status' => false,
                'message' => 'Se ha producido un error al obtener los productos: ' . $error->getMessage()
            ], 500);
        }
    }

    public function getProducto($id){
        try {
            $product = Product::getProduct($id);

            if (!$product) {
                return response()->json([
                    'status' => true,
                    'message' => 'El producto no existe'
                ]);
            }
            $product->images = self::getProductImages($product->id_comercio, $product->id);

            return response()->json([
                'status' => true,
                'product' => $product,
                'comercio' => CommerceController::getNombreProfile($product->id_comercio)
            ]);
        } catch (\Exception $error) {
            return response()->json([
                'status' => false,
                'message' => 'Se ha producido un error al obtener los productos: ' . $error->getMessage()
            ], 500);
        }
    }

    public function getProductosComercioCliente($id)
    {
        try {
            $products = Product::getByCommerceIdForCustomer($id);

            if ($products->isEmpty()) {
                return response()->json([
                    'status' => true,
                    'message' => 'El comercio seleccionado no tiene productos'
                ]);
            }

            $products->transform(function ($product) use ($id) {
                $product->images = self::getProductImages($id, $product->id);
                return $product;
            });

            return response()->json([
                'status' => true,
                'products' => $products
            ]);
        } catch (\Exception $error) {
            return response()->json([
                'status' => false,
                'message' => 'Se ha producido un error al obtener los productos: ' . $error->getMessage()
            ], 500);
        }
    }

    public static function getProductosComercioMercado($id)
    {
        try {
            $products = Product::getByCommerceIdForCustomer($id);

            if ($products->isEmpty()) {
                return [];
            }

            $products->transform(function ($product) use ($id) {
                $product->images = self::getProductImages($id, $product->id);
                return $product;
            });

            return $products;
        } catch (\Exception $error) {
            return [];
        }
    }

    public static function getProductImages($commerceId, $productId)
    {
        $productDir = public_path("images/commerce/{$commerceId}/{$productId}");
        if (file_exists($productDir) && is_dir($productDir)) {
            $files = scandir($productDir);

            // Filtrar solo los archivos de imagen (si es necesario)
            $imageFiles = array_filter($files, function ($file) {
                // Filtrar solo los archivos de imagen con extensiones comunes
                $imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
                $extension = pathinfo($file, PATHINFO_EXTENSION);
                return in_array(strtolower($extension), $imageExtensions);
            });

            // Construir las URL de las imágenes
            $imageUrls = array_map(function ($file) use ($commerceId, $productId) {
                return asset("images/commerce/{$commerceId}/{$productId}/{$file}");
            }, $imageFiles);

            // Convertir a un array si está vacío
            $imageUrls = empty($imageUrls) ? [] : array_values($imageUrls);

            return $imageUrls;
        }

        return [];
    }

    public function addProducto(ProductRequest $request)
    {
        try{
            $user = Auth::user();
            $comercio = Commerce::findCommerce($user->email);
            if ($comercio) {
                $validator = Validator::make($request->input(), $request->rules());
                if ($validator->fails()) {
                    $errors = $validator->errors()->toArray();
                    throw new ValidationError($errors, 400);
                }
                $infoProducto = $request->except(['id', 'id_comercio', 'images']);
                $infoProducto['id_comercio'] = $comercio->id;
                $producto = Product::addProduct($infoProducto);

                if ($request->hasFile('images')) {
                    $images = $request->file('images');
                    $this->handleProductImages($images, $comercio->id, $producto->id);
                }

                return response()->json([
                    'status' => true,
                    'producto' => 'Producto añadido correctamente'
                ], 200);
            }else{
                throw new ActionNotAuthorized();
            }
        }catch(ActionNotAuthorized $error){
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $error->getCode());
        }catch(Error $error){
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $error->getCode());
        }
    }

    private function handleProductImages($images, $commerceId, $productId)
    {
        $commerceDir = public_path("images/commerce/{$commerceId}");
        $productDir = "{$commerceDir}/{$productId}";

        // Verificar si hay imágenes
        if (!empty($images)) {
            // Borrar directorio si existe
            if (File::exists($productDir)) {
                File::deleteDirectory($productDir);
            }

            // Crear nuevo directorio
            File::makeDirectory($productDir, 0755, true);

            foreach ($images as $index => $image) {
                $imageName = ($index + 1) . '.' . $image->getClientOriginalExtension();
                $image->move($productDir, $imageName);
            }
        }
    }




    public function deleteProducto($id){
        try {
            $user = Auth::user();
            $comercio = Commerce::findCommerce($user->email);
            $producto = Product::findProduct($id);
            if ($comercio) {
                if ($producto) {
                    if ($comercio->id == $producto->id_comercio) {
                        $delete = Product::deleteProduct($id);
                        return response()->json([
                            'status' => true,
                            'message' => 'Producto eliminado correctamente'
                        ], 200);
                    } else {
                        throw new Error('El producto seleccionado no pertenece a este comercio.', 400);
                    }
                } else {
                    throw new Error('El producto seleccionado no existe.', 400);
                }
            }else {
                throw new ActionNotAuthorized();
            }
        }catch(ActionNotAuthorized $error){
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $error->getCode());
        }catch(Error $error){
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $error->getCode());
        }
    }

    public function deleteProductos(Request $request){
        try {
            $arrayId = $request->ids;
            $user = Auth::user();
            $comercio = Commerce::findCommerce($user->email);
            $commerceProductsId = array();
            if ($comercio) {
                foreach ($arrayId as $id) {
                    $producto = Product::findProduct($id);
                    if ($producto) {
                        if ($comercio->id == $producto->id_comercio) {
                            $commerceProductsId[] = $producto->id;
                        }
                    }
                }
                foreach ($commerceProductsId as $id) {
                   Product::deleteProduct($id);
                }
                        return response()->json([
                            'status' => true,
                            'message' => 'Productos eliminados correctamente'
                        ], 200);
            }else {
                throw new ActionNotAuthorized();
            }
        }catch(ActionNotAuthorized $error){
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $error->getCode());
        }catch(Error $error){
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $error->getCode());
        }
    }

    public function editProducto(ProductRequest $request){
        try {

            $user = Auth::user();
            $comercio = Commerce::findCommerce($user->email);

            if ($comercio) {
                $validator = Validator::make($request->input(), $request->rules());
                if ($validator->fails()) {
                    $errors = $validator->errors()->toArray();
                    throw new ValidationError($errors, 400);
                }
                $infoProducto = $request->except(['id_comercio', 'borrado', 'images']);
                Product::editProduct($infoProducto);
                if ($request->hasFile('images')) {
                    $images = $request->file('images');
                    $this->handleProductImages($images, $comercio->id, $infoProducto['id']);
                }

                return response()->json([
                    'status' => true,
                    'message' => 'Producto editado correctamente',
                ]);
            }else{
                throw new ActionNotAuthorized();
            }

        }catch(ActionNotAuthorized $error){
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $error->getCode());
        }catch(Error $error){
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $error->getCode());
        }
    }



}
