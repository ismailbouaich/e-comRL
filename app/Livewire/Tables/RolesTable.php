<?php

namespace App\Livewire\Tables;

use App\Models\Role;
use Livewire\Component;
use Livewire\WithPagination;
use Livewire\Attributes\Url;

class RolesTable extends Component
{
    use WithPagination;

    #[Url(history:true)]
    public $search = '';

    #[Url(history:true)]
    public $sortBy = 'created_at';


    #[Url(history:true)]
    public $admin = '';

    #[Url(history:true)]
    public $sortDir = 'DESC';

    #[Url()]
    public $perPage = 5;

    public function updatedSearch(){
        $this->resetPage();
    }

    public function delete(Role $role){
        $role->delete();
    }
    public function setSortBy($sortByField){

        if($this->sortBy === $sortByField){
            $this->sortDir = ($this->sortDir == "ASC") ? 'DESC' : "ASC";
            return;
        }

        $this->sortBy = $sortByField;
        $this->sortDir = 'DESC';
    }
    public function render()
    {
        return view('livewire.tables.roles-table',[
            'roles' => Role::search($this->search)
            ->when($this->admin !== '',function($query){
                $query->where('name',$this->admin);
            })
            ->orderBy($this->sortBy,$this->sortDir)
            ->paginate($this->perPage)
        ]);
    }
}
