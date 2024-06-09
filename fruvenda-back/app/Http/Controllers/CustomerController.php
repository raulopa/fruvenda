<?php

namespace App\Http\Controllers;

use App\Exceptions\ActionNotAuthorized;
use App\Exceptions\ValidationError;
use App\Http\Requests\CommerceRegisterRequest;
use App\Http\Requests\CustomerEditRequest;
use App\Http\Requests\CustomerRegisterRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\Commerce;
use App\Models\Customer;
use App\Models\Post;
use App\Models\User;
use Error;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CustomerController extends Controller
{
    public function registerCliente(CustomerRegisterRequest $request)
    {

        $validator = Validator::make($request->input(), $request->rules());
        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()->toArray()
            ], 400);
        }

        $userTableData = $request->only(['nombre', 'email', 'password', 'password_confirmation']);
        $requestUser = new RegisterRequest;
        $requestUser->merge($userTableData);
        $responseAuth = AuthController::registro($requestUser);

        if ($responseAuth['status']) {
            $customerTableData = $request->except(['password', 'password_confirmation']);
            $cliente = Customer::createCustomer($customerTableData);

            return response()->json([
                'status' => true,
                'type' => 0,
                'entity' => $cliente,
                'auth' => $responseAuth

            ], 200);

        } else {
            return response()->json($responseAuth);
        }
    }

    public function editCliente(CustomerEditRequest $request)
    {
        try {
            $user = Auth::user();
            $cliente = Customer::findCustomer($user->email);
            if ($cliente) {
                $validator = Validator::make($request->all(), $request->rules());
                if ($validator->fails()) {
                    $errors = $validator->errors()->toArray();
                    throw new ValidationError($errors, 400);
                }

                $infoCliente = $request->except('image');
                $infoCliente['id'] = $cliente->id;
                $infoCliente['email'] = $cliente->email;
                $editCliente = Customer::editCustomer($infoCliente);

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
                    'cliente' => $editCliente
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

    public static function getNombreProfile($idCliente)
    {
        $cliente = Customer::findCustomerById($idCliente);
        $user = User::where('email', $cliente->email)->first();
        if ($cliente) {
            return [
                'nombreCompleto' => $cliente->nombre . ' ' . $cliente->apellidos,
                'imagen' => self::getProfileImageUrl($user->id),
                'id' => $cliente->id
            ];
        } else {
            return 'Cliente no encontrado';
        }
    }


    public function getCliente()
    {
        try {
            $user = Auth::user();
            $cliente = json_decode(json_encode(Customer::findCustomer($user->email)), true);

            if ($cliente) {
                return response()->json([
                    'status' => true,
                    'cliente' => $cliente,
                    'image' => self::getProfileImageUrl($user->id)
                ]);
            } else {
                throw new ActionNotAuthorized();
            }
        } catch (ActionNotAuthorized $error) {
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $error->getCode());
        } catch (\Exception $error) {
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $error->getCode() == 0 ? 400 : $error->getCode());
        }
    }
    public function getClienteById($id)
    {
        try {
            $cliente =json_decode(json_encode(Customer::findCustomerById($id)), true);

            if ($cliente) {
                return response()->json([
                    'status' => true,
                    'cliente' => $cliente,
                    'image' => self::getProfileImageUrl(User::where('email', $cliente['email'])->first()->id)
                ], 200);
            } else {
                throw new ActionNotAuthorized();
            }
        } catch (ActionNotAuthorized $error) {
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ],401);
        } catch (\Exception $error) {
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], 400);
        }
    }



    public function setComercioSeguido($idComercio)
    {
        try {
            $user = Auth::user();
            $cliente = Customer::findCustomer($user->email);

            if ($cliente) {
                $comercio = Commerce::findCommerceById($idComercio);
                $seguido = Customer::getFollowedCommerce($cliente->id, $comercio->id);
                if ($comercio) {
                    if ($seguido) {

                        return response()->json([
                            'status' => true,
                            'seguido' => Customer::deleteFollowedCommerce($cliente->id, $comercio->id)
                        ], 200);
                    } else {
                        return response()->json([
                            'status' => true,
                            'seguido' => Customer::setFollowedCommerce($cliente->id, $comercio->id)
                        ], 200);
                    }
                } else {
                    throw new \Exception('El comercio no se ha encontrado', 404);
                }
            } else {
                throw new ActionNotAuthorized();
            }
        } catch (ActionNotAuthorized $error) {
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $error->getCode());
        } catch (\Exception $error) {
            $statusCode = $error->getCode();
            if (!is_int($statusCode) || $statusCode === 0) {
                $statusCode = 400; // Código de estado por defecto
            }
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $statusCode);
        }
    }
    public function getUltimosPostDeSeguidos() {
        try {
            $user = Auth::user();
            $cliente = Customer::findCustomer($user->email);

            if ($cliente) {
                $seguidos = Customer::getFollowedCommerces($cliente->id)->toArray();
                $seguidosConImagenes = array_map(function ($seguido) {
                    $comercio = CommerceController::getNombreProfile($seguido->id_comercio); // Asegúrate de tener este método
                    return [
                        'id' => $seguido->id,
                        'cliente' => $seguido->id_cliente,
                        'id_comercio' => $seguido->id_comercio,
                        'comercio_nombre' => $comercio['nombreCompleto'],
                        'comercio_foto' => $comercio['imagen']
                    ];
                }, $seguidos);

                // Obtener los IDs de los comercios seguidos
                $seguidoIds = array_column($seguidosConImagenes, 'id_comercio');

                // Obtener los últimos posts de los comercios seguidos
                $posts = Post::getLastFollowedPosts($seguidoIds)->toArray();

                // Añadir información del comercio a cada post
                $postsConComercio = array_map(function ($post) use ($seguidosConImagenes) {
                    $comercio = array_filter($seguidosConImagenes, function ($seguido) use ($post) {
                        return $seguido['id_comercio'] == $post->id_comercio;
                    });
                    $comercio = reset($comercio); // Obtener el primer elemento del array filtrado
                    return [
                        'id' => $post->id,
                        'cuerpo' => $post->cuerpo,
                        'fecha' => $post->fecha,
                        'comercio_nombre' => $comercio['comercio_nombre'],
                        'comercio_foto' => $comercio['comercio_foto']
                    ];
                }, $posts);

                return response()->json([
                    'status' => true,
                    'posts' => $postsConComercio
                ], 200);
            } else {
                throw new ActionNotAuthorized('No autorizado', 401);
            }
        } catch (ActionNotAuthorized $error) {
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $error->getCode());
        } catch (\Exception $error) {
            $statusCode = $error->getCode();
            if (!is_int($statusCode) || $statusCode === 0) {
                $statusCode = 400; // Código de estado por defecto
            }
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $statusCode);
        }
    }

    public function getSeguidos(){
        try {
            $user = Auth::user();
            $cliente = Customer::findCustomer($user->email);

            if ($cliente) {
                $seguidos = Customer::getFollowedCommerces($cliente->id)->toArray();
                $seguidosConImagenes = array_map(function ($seguido) {
                    $comercio = CommerceController::getNombreProfile($seguido->id_comercio); // Asegúrate de tener este método
                    return [
                        'id' => $seguido->id,
                        'cliente' => $seguido->id_cliente,
                        'id_comercio' => $seguido->id_comercio,
                        'slug' => $comercio['slug'],
                        'comercio_nombre' => $comercio['nombreCompleto'],
                        'comercio_foto' => $comercio['imagen']
                    ];
                }, $seguidos);
                return response()->json([
                    'status' => true,
                    'seguidos' => $seguidosConImagenes
                ], 200);
            } else {
                throw new ActionNotAuthorized('No autorizado', 401);
            }
        } catch (ActionNotAuthorized $error) {
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $error->getCode());
        } catch (\Exception $error) {
            $statusCode = $error->getCode();
            if (!is_int($statusCode) || $statusCode === 0) {
                $statusCode = 400; // Código de estado por defecto
            }
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $statusCode);
        }
    }

    public function getSiComercioSeguido($idComercio)
    {
        try {
            $user = Auth::user();
            $cliente = Customer::findCustomer($user->email);

            if ($cliente) {
                $comercio = Commerce::findCommerceById($idComercio);
                if ($comercio) {
                    return response()->json([
                        'status' => true,
                        'seguido' => Customer::getFollowedCommerce($cliente->id, $comercio->id)
                    ], 200);
                } else {
                    throw new \Exception('El comercio no se ha encontrado', 404);
                }
            } else {
                throw new ActionNotAuthorized('No autorizado', 401);
            }
        } catch (ActionNotAuthorized $error) {
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $error->getCode());
        } catch (\Exception $error) {
            $statusCode = $error->getCode();
            if (!is_int($statusCode) || $statusCode === 0) {
                $statusCode = 400; // Código de estado por defecto
            }
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $statusCode);
        }
    }

}
