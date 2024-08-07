<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use \App\Http\Controllers;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');




/* AUTENTICACIÓN BÁSICA */
//Registro
Route::post('/registro', [Controllers\AuthController::class, 'registro']);
Route::post('/registroComercio', [Controllers\CommerceController::class, 'registerComercio']);
Route::post('/registroCliente', [Controllers\CustomerController::class, 'registerCliente']);
//Login
Route::post('/login', [Controllers\AuthController::class, 'login']);
Route::get('/buscar/{entidad}', [Controllers\SearchController::class, 'searchEntidad']);

/* CLIENTE */
Route::group(['prefix' => 'usuario', 'middleware' => ['auth:sanctum']], function (){
    Route::get('/', [Controllers\CustomerController::class, 'getCliente']);
    Route::post('/edit', [Controllers\CustomerController::class, 'editCliente']);
    Route::get('/logout', [Controllers\AuthController::class, 'logout']);
    Route::get('/seguido/{idComercio}', [Controllers\CustomerController::class, 'getSiComercioSeguido']);
    Route::get('/seguir/{idComercio}', [Controllers\CustomerController::class, 'setComercioSeguido']);
    Route::get('/seguidos', [Controllers\CustomerController::class, 'getSeguidos']);
    Route::get('/ultimos', [Controllers\CustomerController::class, 'getUltimosPostDeSeguidos']);

});
Route::group(['prefix' => 'usuario'], function () {
    Route::get('/{id}', [Controllers\CustomerController::class, 'getClienteById']);
    Route::get('/resenas/{id}', [Controllers\ReviewController::class, 'getResenasClienteById']);
});


/* PRODUCTOS */
Route::group(['prefix' => 'productos', 'middleware' => ['auth:sanctum']], function (){
    Route::get('/', [Controllers\ProductController::class, 'getProductosComercio']);
    Route::post('/add', [Controllers\ProductController::class, 'addProducto']);
    Route::post('/edit', [Controllers\ProductController::class, 'editProducto']);
    Route::delete('/{id}', [Controllers\ProductController::class, 'deleteProducto']);
    Route::delete('/', [Controllers\ProductController::class, 'deleteProductos']);
});

Route::group(['prefix' => 'productos'], function (){
    Route::get('/comercio/{id}',  [Controllers\ProductController::class, 'getProductosComercioCliente']);
    Route::get('/{id}', [Controllers\ProductController::class, 'getProducto']);
});

/* COMERCIO */
Route::group(['prefix' => 'comercio', 'middleware' => ['auth:sanctum']], function (){
    Route::post('/edit', [Controllers\CommerceController::class, 'editComercio']);
    Route::get('/',  [Controllers\CommerceController::class, 'getComercio']);
    Route::delete('/delete', [Controllers\CommerceController::class, 'deleteComercio']);
});
Route::group(['prefix' => 'comercio'], function (){
    Route::get('/mercado/{id}',  [Controllers\CommerceController::class, 'getCommercesByMarket']);
    Route::get('/resenas/{slug}',  [Controllers\CommerceController::class, 'getResenasComercioBySlug']);
    Route::get('/{slug}',  [Controllers\CommerceController::class, 'getCommerceBySlug']);

});

/* CARRITO */
Route::group(['prefix' => 'carrito'], function (){
    Route::post('/addCarrito', [Controllers\CartController::class, 'addToCarrito']);
    Route::get('/getContenidoCarrito/{token}', [Controllers\CartController::class, 'getCarrito']);
    Route::get('/deleteFilaCarrito/{cartToken}/{idRow}', [Controllers\CartController::class, 'deleteFilaCarrito']);
});

/* PEDIDO */
Route::group(['prefix' => 'pedidos', 'middleware' => ['auth:sanctum']], function (){
    Route::get('/getPedidosPendientes', [Controllers\OrderController::class, 'getPedidosPendientes']);
    Route::get('/getPedidos', [Controllers\OrderController::class, 'getPedidos']);
    Route::get('/changeEstado/{idOrder}/{estado}', [Controllers\OrderController::class, 'changeEstado']);
    Route::get('/cancelar/{idOrder}', [Controllers\OrderController::class, 'cancelPedido']);
    Route::get('/getPedidosCliente', [Controllers\OrderController::class, 'getPedidosCliente']);
    Route::get('/getPedidosPendientesCliente', [Controllers\OrderController::class, 'getPedidosPendientesCliente']);
    Route::post('/tomarPedido', [Controllers\OrderController::class, 'takePedido']);
    Route::get('/{cartToken}',  [Controllers\OrderController::class, 'doPedido']);

});

/* MERCADO */
Route::group(['prefix' => 'mercado', 'middleware' => ['auth:sanctum']], function (){
    Route::post('/suscribir', [Controllers\MarketController::class, 'suscribeToMarket']);
    Route::get('/suscrito', [Controllers\MarketController::class, 'suscribedMarkets']);
});

Route::group(['prefix' => 'mercado'], function (){
    Route::get('/{slug}', [Controllers\MarketController::class, 'getMercado']);
    Route::get('/buscar/{cp}', [Controllers\MarketController::class, 'searchMarketsByCp']);
    Route::get('/', [Controllers\MarketController::class, 'getMercados']);
});

/* RESEÑAS */
Route::group(['prefix' => 'resenas', 'middleware' => ['auth:sanctum']], function (){
    Route::post('/enviar/{slug}', [Controllers\ReviewController::class, 'sendResena']);
    Route::get('/cliente', [Controllers\ReviewController::class, 'getResenasCliente']);
    Route::get('/comercio', [Controllers\ReviewController::class, 'getResenasComercio']);
    Route::delete('/borrar/{id}', [Controllers\ReviewController::class, 'deleteResena']);
});

/* POST */
Route::group(['prefix' => 'posts', 'middleware' => ['auth:sanctum']], function (){
    Route::get('/comercio', [Controllers\PostController::class, 'getPostComercio']);
    Route::post('/publicar', [Controllers\PostController::class, 'publishPost']);
    Route::delete('/{id}', [Controllers\PostController::class, 'deletePost']);
});

Route::group(['prefix' => 'posts'], function (){
    Route::get('/comercio/{slug}', [Controllers\PostController::class, 'getPostComerciosBySlug']);
});


/* HORARIOS */
Route::group(['prefix' => 'horario', 'middleware' => ['auth:sanctum']], function (){
    Route::get('/', [Controllers\TimetableController::class, 'getHorario']);
    Route::post('/', [Controllers\TimetableController::class, 'saveHorario']);

});

Route::group(['prefix' => 'horario'], function (){
    Route::get('/{idComercio}', [Controllers\TimetableController::class, 'ggetTHorario']);
});

