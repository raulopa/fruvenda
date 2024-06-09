<!doctype html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Estado del Pedido Actualizado</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css">
</head>
<body class="min-h-screen flex flex-col justify-center items-center bg-gray-100">
<div class="bg-white p-10 rounded-lg shadow-md text-center max-w-md mx-auto">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12H9m0 0v3m0-3v-3m0 6v6m0 0h6m0-6V6m0 6v3m0-6v6m0-3h6m-6-6h-6" />
    </svg>
    <h1 class="text-2xl font-bold text-gray-800 mb-2">¡Estado del Pedido Actualizado!</h1>
    <p class="text-gray-500 mb-6">El estado de tu pedido ha sido actualizado a {{$estado}}. Revisa los detalles en tu dashboard.</p>
</div>
</body>
</html>
