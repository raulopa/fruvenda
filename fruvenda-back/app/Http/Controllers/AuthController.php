<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterRequest;
use App\Models\Commerce;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    public static function registro(RegisterRequest $request)
    {

        $validator = Validator::make($request->input(), $request->rules());
        if ($validator->fails()) {
            return [
                'status' => false,
                'errors' => $validator->errors()->toArray()
            ];
        }

        $usuario = User::create([
            'name' => $request->nombre,
            'email' => $request->email,
            'password' => Hash::make($request->password)
        ]);

        return [
            'status' => true,

            'token' => $usuario->createToken('API TOKEN')->plainTextToken
        ];
    }

    public function login(Request $request)
    {
        $rules = [
            'email' => 'required|email',
            'password' => 'required'
        ];

        $validator = Validator::make($request->input(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()->all()
            ], 400);
        }

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'status' => false,
                'message' => 'Usuario no válido',
            ], 401);
        }

        $usuario = User::where('email', $request->email)->first();
        $cliente = Customer::findCustomer($request->email);
        $comercio = Commerce::findCommerce($request->email);

        return response()->json([
            'status' => true,
            'type' => $cliente == null ? 1 : 0,
            'entity' => $cliente == null ? $comercio : $cliente,
            'token' => $usuario->createToken('API TOKEN')->plainTextToken
        ], 200);

    }

    public function logout()
    {
        auth()->user()->tokens()->delete();
        return response()->json([
            'status' => true,
            'message' => 'Cierre de sesión correcto'
        ]);
    }
}
