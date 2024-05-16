<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ResetRequest;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB ;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;


class ResetController extends Controller
{
    public function resetPassword(ResetRequest $request)
    {

        $email=$request->email;
        $token=$request->token;
        $password=Hash::make($request->password);

        $emailcheck=DB::table('password_reset_tokens')->where('email',$email)->first();
        $pincheck=DB::table('password_reset_tokens')->where('token',$token)->first();

        if (!$emailcheck) {

            return response([
                'message'=>'Email not Found'
            ],401);

        }
        if (!$pincheck) 
        {

            return response([
                'message'=>'Pin not Found'
            ],401);
        }


            DB::table('users')->where('email',$email)->update(['password'=>$password]);
            DB::table('password_reset_tokens')->where('email',$email)->delete();

            return response([
                'message'=>'Password Change Successfully'
            ]);
       

    }
}
