<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function user(){
        return Auth::user();
    }


    public function userlist(Request $request)
    {
       
        $users = User::paginate(5); 
    
        return response()->json($users);
    }
    public function edit($id)
    {
     try { 
         
         
         $user=User::findOrFail($id);
         return response()->json($user);
     } catch (\Exception $e) {
         return response()->json(['error' => 'Student not found'], 404);
     }
 
     
    } 

    public function update(Request $request, $id) {
    
        
        User::findOrFail($id)->update([
         
            'name'=>$request->name,
            'email'=>$request->email,
            'password'=>Hash::make($request->password) ,
           
            ]);
            
            return response()->json(['message' => 'User updated successfully']);
    
    }

}
