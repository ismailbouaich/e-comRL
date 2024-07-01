<?php

namespace App\Livewire\Create;

use App\Models\Role;
use Livewire\Component;

class CreateRole extends Component
{

    public $name;


   

      public function submit(){

      
        $this->validate([
            'name' => 'required|min:3|max:255',
        ]);
    
        Role::create([
            'name' => $this->name,
        ]);
    
        $this->reset(['name']);
    
        $this->dispatch('role-create');
   }
     public function cancel()  {
        return  $this->reset(['name']);
  
      }
    public function render()
    {
        return view('livewire.create.create-role');
    }
}
