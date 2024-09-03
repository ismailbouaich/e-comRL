<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

use App\Http\Requests\RegisterRequest;




class AuthController extends Controller
{
    public function login(Request $request)
{
    try {
        if (Auth::attempt($request->only('email', 'password'))) {
            $user = Auth::user();

            if ($user->hasRole('customer')) {
                $token = $user->createToken('app')->accessToken;

                return response([
                    'message' => 'Successfully Login',
                    'token' => $token,
                    'user' => $user
                ], 200);
            } else {
                return response([
                    'message' => 'You do not have the rights to access',
                ], 403);
            }
        }
    } catch (\Exception $exception) {
        return response(['message' => $exception->getMessage()], 500);
    }

    return response([
        'message' => 'Invalid Email Or Password'
    ], 401);
}

public function register(RegisterRequest $request)
{
    try {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => '3'
        ]);

        $token = $user->createToken('app')->accessToken;

        $admins = User::whereHas('role', function ($query) {
            $query->where('name', 'admin');
        })->get();

        foreach ($admins as $admin) {
            $notification = new \MBarlow\Megaphone\Types\Important(
                'New Order Placed',
                'A new order has been placed by ',
                'https://example.com/order-details', // Optional: URL
                'View Order Details' // Optional: Link Text
            );
            $admin->notify($notification);
        }

        return response([
            'message' => 'Registration Successfully',
            'token' => $token,
            'user' => $user
        ], 200);
    } catch (\Exception $exception) {
        return response(['message' => $exception->getMessage()], 400);
    }
}



public function loginDelivery(Request $request)
{
    try {
        if (Auth::attempt($request->only('email', 'password'))) {
            $user = Auth::user();
            if ($user->hasRole('delivery_worker')) {
                $token = $user->createToken('app')->accessToken;
                return response([
                    'message' => 'Successfully Login',
                    'token' => $token,
                    'user' => $user
                ], 200);
            } else {
                return response([
                    'message' => 'You do not have the rights to access',
                ], 403);
            }
        } else {
            return response([
                'message' => 'Invalid credentials',
            ], 401);
        }
    } catch (\Exception $exception) {
        return response([
            'message' => 'An error occurred during login',
            'error' => $exception->getMessage()
        ], 500);
    }
}

    public function registerDelivery(Request $request)
    {
        try {
            $user=User::create([
                'name'=>$request->name,
                'email'=>$request->email,
                'password'=>Hash::make($request->password),
                'role_id'=>'2'
            ]);

            $token=$user->createToken('app')->accessToken;

            return response([
                'message'=>'Registration Successfully ',
                'token'=>$token,
                'user'=>$user
              ],200);
            

        } catch (\Exception $exception) {
            return response(['message'=>$exception->getMessage()],400);

        }
    
       
    }
}
