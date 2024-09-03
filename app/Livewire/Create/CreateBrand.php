<?php

namespace App\Livewire\Create;

use App\Models\Brand;
use Livewire\Component;
use Livewire\WithFileUploads;

class CreateBrand extends Component
{
    use WithFileUploads;

    public $name,$logo_path;

    protected $rules = [
        'name' => 'required|string|max:255',
        'logo_path.*' => 'image|max:10240',
     ];
    public function updatedLogo_path()
    {
        $this->validate([
            'logo_path.*' => 'image|max:10240', // Max file size: 10MB
        ]);
    }



    public function submit()
    {
        $this->validate();

        $path = $this->logo_path->store('/logo');


        $brand = Brand::create([
            'name' => $this->name,
            'logo_path' =>$path,
           
        ]);
        $this->reset(['name','logo_path']);

        session()->flash('message', 'Brand successfully created with Logo.');
    }
    public function render()
    {
        return view('livewire.create.create-brand');
    }
}
