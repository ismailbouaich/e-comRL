<?php

namespace App\Livewire\Create;

use App\Models\Role;
use App\Models\User;
use Livewire\Component;




class CreateUser extends Component
{
    public $name; 
    public $email;
    public $password;
    public $password_confirmation;
    public $selectedRole;
    public $roles;
    public $role_id;

   
    public function updatedSelectedRole($value)
{
    $this->role_id = $value;
}
    
    public function submit(){

      
            $this->validate([
                'name' => 'required|min:3|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|min:6',
                'password_confirmation' => 'required|same:password',
                'role_id' => 'required|exists:roles,id',
            ]);
        
            User::create([
                'name' => $this->name,
                'email' => $this->email,
                'password' => bcrypt($this->password),
                'role_id' => $this->role_id
            ]);
        
            $this->reset(['name', 'email', 'password', 'password_confirmation', 'role_id']);
        
            session()->flash('success', 'User created successfully!');
       
       
    }
    
    public function generatePassword() : Void {

        $lowercase=range('a','z');
        $uppercase=range('A','Z');
        $digits=range(0,9);
        $special=['!','@','#','$','%','^','&','*'];
        $chars=array_merge($lowercase,$uppercase,$digits,$special);

        $length=env('PASSWORD_LENGTH',8);


        do {
            $password=array();
            
            for($i=0;$i<=$length;$i++)
            {
                $int=rand(0,count($chars)-1);

                array_push($password,$chars[$int]);
            }

        } while (empty(array_intersect($special,$password)));

        $this->setPasswords(implode('',$password));
        
    }


    public function setPasswords($value)  {
        $this->password=$value;

        $this->password_confirmation=$value;
        
    }
    public function cancel()  {
      return  $this->reset(['name', 'email', 'password', 'password_confirmation', 'role_id']);

    }
    public function mount()
    {
        $this->roles = Role::all(); // Assuming you have a Role model
    }
    public function render()
    {
        return view('livewire.create.create-user');
    }
}
