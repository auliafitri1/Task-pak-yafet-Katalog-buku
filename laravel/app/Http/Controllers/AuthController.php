<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash; // ← dipakai untuk register

class AuthController extends Controller
{
    // 🔹 REGISTER
    public function register(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'email'      => 'required|email|unique:penggunas,email',
            'password'   => 'required|min:6',
            'role'       => 'required|in:user,admin',
        ]);

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name'  => $request->last_name,
            'email'      => $request->email,
            'password'   => Hash::make($request->password),
            'role'       => $request->role,
        ]);

        return response()->json([
            'message' => 'Registrasi berhasil!',
            'data'    => $user,
        ], 201);
    }



    // 🔹 LOGIN
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required'
        ]);

        $credentials = $request->only('email', 'password');

        // cek email & password
        try {
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('api-token')->plainTextToken;

            return response()->json([
                'status' => 'success',
                'token'  => $token,
                'user'   => $user
            ]);
        }

        return response()->json([
            'status'  => 'error',
            'message' => 'Email atau password salah'
        ], 401);

    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage()
        ], 500);
    }

    }

    // 🔹 LOGOUT
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Logout berhasil!'
        ]);
    }
}
