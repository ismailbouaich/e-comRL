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
         return response()->json(['error' => 'user not found'], 404);
     }
 
     
    } 

    public function validatePassword(Request $request)
{
    $user = Auth::user();

    if (!Hash::check($request->current_password, $user->password)) {
        return response()->json(['error' => 'Current password is incorrect'], 401);
    }

    return response()->json(['message' => 'Current password is correct']);
}

    public function update(Request $request, $id) {
    
         $user = User::findOrFail($id);

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$id,
            'password' => 'sometimes|required|string|min:8|confirmed',
        ]);

       
        
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['error' => 'Current password is incorrect'], 401);
        }

        $user->name = $validatedData['name'];
        $user->email = $validatedData['email'];
        
        if (isset($validatedData['password'])) {
            $user->password = Hash::make($validatedData['password']);
        }

        $user->save();


            
            return response()->json(['message' => 'User updated successfully']);
    
    }

}
