<?php

namespace App\Http\Controllers;

use App\Exceptions\ActionNotAuthorized;
use App\Exceptions\AuthError;
use App\Exceptions\ValidationError;
use App\Http\Requests\CommerceEditRequest;
use App\Http\Requests\CommerceRegisterRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\Commerce;
use App\Models\Customer;
use App\Models\Review;
use App\Models\User;
use Error;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class CommerceController extends Controller
{
    public function registerComercio(CommerceRegisterRequest $request)
    {
        try {
            $validator = Validator::make($request->input(), $request->rules());
            if ($validator->fails()) {
                throw new ValidationError($validator->errors()->toArray(), 400);
            }
            $userTableData = $request->only(['nombre', 'email', 'password', 'password_confirmation']);
            $requestUser = new RegisterRequest;
            $requestUser->merge($userTableData);
            $responseAuth = AuthController::registro($requestUser);
            if ($responseAuth['status']) {
                $commerceTableData = $request->except(['password', 'password_confirmation']);
                $commerceTableData['activo'] = true;

                $comercio = Commerce::createCommerce($commerceTableData);
                Commerce::createSlug($comercio->id, Str::slug($comercio->nombre) . '-' . $comercio->id);
                return response()->json([
                    'status' => true,
                    'type' => 1,
                    'entity' => $comercio,
                    'auth' => $responseAuth
                ], 200);
            } else {
                throw new AuthError($responseAuth);
            }
        } catch (AuthError|ValidationError $error) {
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

    public function getComercio()
    {
        try {
            $user = Auth::user();
            $comercio = Commerce::findCommerce($user->email);
            if ($comercio) {
                return response()->json([
                    'status' => false,
                    'comercio' => $comercio,
                    'image' => self::getProfileImageUrl($user->id)
                ], 200);
            } else {
                throw new ActionNotAuthorized();
            }
        } catch (ActionNotAuthorized|ValidationError $error) {
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $error->getCode());
        } catch (Error $error) {
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $error->getCode() == 0 ? 400 : $error->getCode());
        }
    }

    public static function getProfileImageUrl($userId)
    {
        $extensions = ['jpg', 'jpeg', 'png'];
        $folderPath = public_path("profile_images/{$userId}");
        foreach ($extensions as $ext) {
            $filePath = "{$folderPath}/{$userId}.{$ext}";
            if (file_exists($filePath)) {
                return asset("profile_images/{$userId}/{$userId}.{$ext}");
            }
        }
        // Si no se encuentra ninguna imagen, devolver una URL predeterminada
        return null;
    }

    public static function getNombreProfile($idComercio)
    {
        $comercio = Commerce::findCommerceById($idComercio);
        $user = User::where('email', $comercio->email)->first();
        if ($comercio) {
            return [
                'nombreCompleto' => $comercio->nombre,
                'imagen' => self::getProfileImageUrl($user->id)
            ];
        } else {
            return null;
        }
    }

    public function getCommercesByMarket($id){
        try {
            $comercios = Commerce::getCommercesByMarket($id)->toArray();

            $comerciosWithAllInfo = array_map(function($comercio) {
                $user = User::where('email', $comercio->email)->first();

                $comercio->productos = ProductController::getProductosComercioMercado($comercio->id)->toArray();

                if ($user) {
                    // Obtén la URL de la foto de perfil
                    $comercio->foto_perfil = self::getProfileImageUrl($user->id);
                } else {
                    // Si el usuario no se encuentra, puedes asignar un valor predeterminado si lo deseas
                    $comercio->foto_perfil = null;
                }
                return $comercio;
            }, $comercios);
            if ($comercios) {
                return response()->json([
                    'status' => false,
                    'comercios' => $comerciosWithAllInfo
                ], 200);
            } else {
                throw new NotFoundHttpException();
            }
        } catch (Error $error) {
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $error->getCode() == 0 ? 400 : $error->getCode());
        }
    }


    public function getCommerceBySlug($slug)
    {
        try {
            $comercio = Commerce::findCommerceBySlug($slug);
            $user = User::where('email', $comercio->email)->first();
            if ($comercio) {
                return response()->json([
                    'status' => false,
                    'comercio' => $comercio,
                    'image' => self::getProfileImageUrl($user->id)
                ], 200);
            } else {
                throw new NotFoundHttpException();
            }
        } catch (Error $error) {
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $error->getCode() == 0 ? 400 : $error->getCode());
        }
    }

    public function getResenasComercioBySlug($slug)
    {
        try {
            $comercio = Commerce::findCommerceBySlug($slug);
            if ($comercio) {
                $resenas = Review::getReviewsCommerce(($comercio->id))->toArray();
                $resenasConClientes = array_map(function ($resena) {
                    $cliente = CustomerController::getNombreProfile($resena->id_cliente); // Asegúrate de tener este método
                    return [
                        'id' => $resena->id,
                        'comercio_id' => $resena->id_comercio,
                        'cliente_id' => $resena->id_cliente,
                        'valoracion' => $resena->valoracion,
                        'titulo' => $resena->titulo,
                        'cuerpo' => $resena->cuerpo,
                        'fecha' => $resena->fecha,
                        'cliente_nombre' => $cliente['nombreCompleto'],
                        'cliente_foto' => $cliente['imagen']
                    ];
                }, $resenas);
                return response()->json([
                    'status' => true,
                    'resenas' => $resenasConClientes
                ], 200);
            } else {
                throw new NotFoundHttpException();
            }
        } catch (Error $error) {
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $error->getCode() == 0 ? 400 : $error->getCode());
        }
    }

    public function editComercio(CommerceEditRequest $request)
    {
        try {
            $user = Auth::user();
            $comercio = Commerce::findCommerce($user->email);
            if ($comercio) {
                $validator = Validator::make($request->input(), $request->rules());
                if ($validator->fails()) {
                    $errors = $validator->errors()->toArray();
                    throw new ValidationError($errors, 400);
                }
                $infoComercio = $request->except(['cif', 'email', 'id', 'image']);
                $infoComercio['id'] = $comercio->id;
                $infoComercio['email'] = $comercio->email;
                $editComercio = Commerce::editCommerce($infoComercio);

                if ($request->hasFile('image')) {
                    $image = $request->file('image');

                    // Crear la carpeta del cliente si no existe
                    $clientFolder = public_path("profile_images/{$user->id}");
                    if (!file_exists($clientFolder)) {
                        mkdir($clientFolder, 0777, true);
                    } else {
                        // Eliminar todos los archivos existentes en la carpeta del cliente
                        $files = glob($clientFolder . '/*'); // obtiene todos los archivos en la carpeta
                        foreach ($files as $file) {
                            if (is_file($file)) {
                                unlink($file); // elimina el archivo
                            }
                        }
                    }

                    $imageName = $user->id . '.' . $image->getClientOriginalExtension();
                    $image->move($clientFolder, $imageName);
                }

                return response()->json([
                    'status' => true,
                    'comercio' => $editComercio
                ], 200);
            } else {
                throw new ActionNotAuthorized();
            }
        } catch (ActionNotAuthorized|ValidationError $error) {
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $error->getCode());
        } catch (Error $error) {
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $error->getCode() == 0 ? 400 : $error->getCode());
        }
    }

    public function deleteComercio()
    {
        try {
            $user = Auth::user();
            $comercio = Commerce::findCommerce($user->email);
            if ($comercio) {
                $eliminados = Commerce::deleteCommerce($comercio->id);
                if ($eliminados) {
                    return response()->json([
                        'status' => true,
                        'comercio' => 'Comercio eliminado correctamente'
                    ], 200);
                } else {
                    throw new Error('El comercio no se ha eliminado', 500);
                }

            } else {
                throw new ActionNotAuthorized();
            }
        } catch (ActionNotAuthorized|ValidationError $error) {
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $error->getCode());
        } catch (Error $error) {
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $error->getCode() == 0 ? 400 : $error->getCode());
        }
    }
}
