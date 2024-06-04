<?php

namespace App\Http\Controllers;

use App\Exceptions\ActionNotAuthorized;
use App\Http\Requests\ReviewRequest;
use App\Models\Commerce;
use App\Models\Customer;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;

class ReviewController extends Controller
{
    public function sendResena(ReviewRequest $request, $slug)
    {
        try {
            $user = Auth::user();
            $cliente = Customer::findCustomer($user->email);

            if ($cliente) {
                $comercio = Commerce::findCommerceBySlug($slug);

                if ($comercio) {
                    $searchReview = Review::findReviewByCustomerCommerce($comercio->id, $cliente->id);
                    if ($searchReview) {
                        throw new \Exception('Ya tienes una reseña para este negocio', 400); // Agregar código de estado
                    } else {
                        $request->merge([
                            'id_comercio' => $comercio->id,
                            'id_cliente' => $cliente->id,
                            'visible' => true,
                            'fecha' => date('Y-m-d')
                        ]);
                        $resena = Review::createReview($request->toArray());
                        return response()->json([
                            'status' => true,
                            'resena' => $resena
                        ], 200);
                    }
                } else {
                    throw new \Exception('El comercio no ha sido encontrado', 404); // Agregar código de estado
                }
            } else {
                throw new ActionNotAuthorized();
            }
        } catch (ActionNotAuthorized $error) {
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], 403); // Código de estado explícito para no autorizado
        } catch (\Exception $error) {
            $statusCode = is_int($error->getCode()) && $error->getCode() > 0 ? $error->getCode() : 400;
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $statusCode);
        }
    }

    public function getResenasCliente(){
        try {
            $user = Auth::user();
            $cliente = Customer::findCustomer($user->email);

            if ($cliente) {
                $resenas = Review::getReviewsCustomer($cliente->id)->toArray();
                $resenasConClientes = array_map(function($resena) {
                    $cliente = CustomerController::getNombreProfile($resena->id_cliente); // Asegúrate de tener este método
                    return [
                        'id' => $resena->id,
                        'comercio_id' => $resena->id_comercio,
                        'cliente_id' => $resena->id_cliente,
                        'valoracion' => $resena->valoracion,
                        'titulo' => $resena->titulo,
                        'cuerpo' => $resena->cuerpo,
                        'fecha' => $resena->fecha,
                        'cliente_nombre' => $cliente['nombreCompleto'] ,
                        'cliente_foto' => $cliente['imagen']
                    ];
                }, $resenas);
                return response()->json([
                    'status' => true,
                    'resenas' => $resenasConClientes
                ], 200);
            } else {
                throw new ActionNotAuthorized();
            }
        } catch (ActionNotAuthorized $error) {
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], 403); // Código de estado explícito para no autorizado
        } catch (\Exception $error) {
            $statusCode = is_int($error->getCode()) && $error->getCode() > 0 ? $error->getCode() : 400;
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $statusCode);
        }
    }

    public function getResenasComercio(){
        try {
            $user = Auth::user();
            $comercio = Commerce::findCommerce($user->email);

            if ($comercio) {
                $resenas = Review::getReviewsCommerce($comercio->id)->toArray();
                $resenasConClientes = array_map(function($resena) {
                    $cliente = CustomerController::getNombreProfile($resena->id_cliente); // Asegúrate de tener este método
                    return [
                        'id' => $resena->id,
                        'comercio_id' => $resena->id_comercio,
                        'cliente_id' => $resena->id_cliente,
                        'valoracion' => $resena->valoracion,
                        'titulo' => $resena->titulo,
                        'cuerpo' => $resena->cuerpo,
                        'fecha' => $resena->fecha,
                        'cliente_nombre' => $cliente['nombreCompleto'] ,
                        'cliente_foto' => $cliente['imagen']
                    ];
                }, $resenas);
                return response()->json([
                    'status' => true,
                    'resenas' => $resenasConClientes
                ], 200);
            } else {
                throw new ActionNotAuthorized();
            }
        } catch (ActionNotAuthorized $error) {
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], 403); // Código de estado explícito para no autorizado
        } catch (\Exception $error) {
            $statusCode = is_int($error->getCode()) && $error->getCode() > 0 ? $error->getCode() : 400;
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $statusCode);
        }
    }

    public function deleteResena($id){
        try {
            $user = Auth::user();
            $cliente = Customer::findCustomer($user->email);

            if ($cliente) {
                $resena = Review::findReviewByCustomer($cliente->id);
                if($resena){
                    Review::deleteReview($resena->id);
                    return response()->json([
                        'status' => true,
                        'message' => 'La reseña ha sido borrada correctamente'
                    ], 200);
                }else {
                    throw new \Exception('La reseña no ha sido eliminada');
                }
            } else {
                throw new ActionNotAuthorized();
            }
        } catch (ActionNotAuthorized $error) {
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], 403); // Código de estado explícito para no autorizado
        } catch (\Exception $error) {
            $statusCode = is_int($error->getCode()) && $error->getCode() > 0 ? $error->getCode() : 400;
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $statusCode);
        }
    }


}
