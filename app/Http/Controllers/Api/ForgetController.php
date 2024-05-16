<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ForgetRequest;
use App\Mail\ForgetMail;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB ;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class ForgetController extends Controller
{
    public function forgetPassword(ForgetRequest $request) {
        $email=$request->email;


        if (User::where('email',$email)->doesntExist()) {
            return response(['message'=>'Email Invalid'],401);
        
        }
        //generate Random Token


        $token=rand(10,100000);

        try {

            DB::table('password_reset_tokens')->insert([
                'email'=>$email,
                'token'=>$token
            ]);
            Mail::to($email)->send(new ForgetMail($token));
            return response([
                'message'=>'Reset Password Mail send on your email'
            ],200);
        } catch (\Exception $exception) {
            return response(['message'=>$exception->getMessage()],400);

        }
    }
}
