<?php

namespace App\Livewire\Show;

use App\Models\Role;
use App\Models\User;
use Livewire\Component;

class UserShow extends Component
{
    public $user;
    public $name; 
    public $email;
    public $password;
    public $password_confirmation;
    public $selectedRole;
    public $roles;
    public $role_id;

    public function mount($userId){


        $user=User::find($userId);
        $this->user=$user;
        $this->name=$user->name;
        $this->email=$user->email;
        $this->password=$user->password;
        $this->password_confirmation=$user->password;
        $this->role_id=$user->role_id;
        $this->roles=Role::orderBy('name','desc')->latest()->get();

    }

    public function render()
    {
        return view('livewire.show.user-show');
    }
}
