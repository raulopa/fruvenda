<?php

namespace App\Http\Controllers;

use App\Exceptions\ActionNotAuthorized;
use App\Http\Requests\PostRequest;
use App\Models\Commerce;
use App\Models\Customer;
use App\Models\Post;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    public function publishPost(PostRequest $request)
    {
        try {
            $user = Auth::user();
            $comercio = Commerce::findCommerce($user->email);

            if ($comercio) {
                $request->merge([
                    'id_comercio' => $comercio->id,
                    'visible' => true,
                    'fecha' => date('Y-m-d H:i:s')
                ]);
                $post = Post::createPost($request->toArray());
                return response()->json([
                    'status' => true,
                    'post' => $post
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

    public function getPostComercio()
    {
        try {
            $user = Auth::user();
            $comercio = Commerce::findCommerce($user->email);

            if ($comercio) {
                $posts = Post::getCommercePost($comercio->id);
                return response()->json([
                    'status' => true,
                    'posts' => $posts
                ], 200);
            } else {
                throw new \Exception('El comercio no fue encontrado');
            }
        } catch (\Exception $error) {
            $statusCode = is_int($error->getCode()) && $error->getCode() > 0 ? $error->getCode() : 400;
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $statusCode);
        }
    }

    public function deletePost($id)
    {
        try {
            $user = Auth::user();
            $comercio = Commerce::findCommerce($user->email);

            if ($comercio) {
                $post = Post::findPost($id);
                if($post->id_comercio == $comercio->id){
                    $deleted = Post::deletePost($id);
                    if($deleted){
                        return response()->json([
                            'status' => true,
                            'deleted' => $deleted
                        ], 200);
                    }else{
                        return response()->json([
                            'status' => false,
                            'message' => 'El post no se pudo eliminar'
                        ], 200);
                    }

                }else{
                    throw new ActionNotAuthorized();
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


    public function getPostComerciosBySlug($slug)
    {
        try {
            $comercio = Commerce::findCommerceBySlug($slug);

            if ($comercio) {
                $posts = Post::getCommercePost($comercio->id);
                return response()->json([
                    'status' => true,
                    'posts' => $posts
                ], 200);
            } else {
                throw new \Exception('El comercio no fue encontrado');
            }
        } catch (\Exception $error) {
            $statusCode = is_int($error->getCode()) && $error->getCode() > 0 ? $error->getCode() : 400;
            return response()->json([
                'status' => false,
                'message' => $error->getMessage()
            ], $statusCode);
        }
    }
}
