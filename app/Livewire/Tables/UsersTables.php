<?php

namespace App\Livewire\Tables;

use Livewire\Component;
use App\Models\User;
use Livewire\WithPagination;
use Livewire\Attributes\Url;

class UsersTables extends Component
{
    use WithPagination;

    #[Url(history:true)]
    public $search = '';

    #[Url(history:true)]
    public $admin = '';

    #[Url(history:true)]
    public $sortBy = 'created_at';

    #[Url(history:true)]
    public $sortDir = 'DESC';

    #[Url()]
    public $perPage = 5;


    public function updatedSearch(){
        $this->resetPage();
    }

    public function delete(User $user){
        $user->delete();
    }

    public function setSortBy($sortByField){

        if ($sortByField === 'role') {
            $sortByField = 'role_id'; // Update to match the database column name
        }
        if($this->sortBy === $sortByField){
            $this->sortDir = ($this->sortDir == "ASC") ? 'DESC' : "ASC";
            return;
        }

        $this->sortBy = $sortByField;
        $this->sortDir = 'DESC';
    }
    public function updatedAdmin($value)
    {
        $this->admin = $value;
        $this->resetPage();
    }
    public function render()
    {
        return view('livewire.tables.users-tables', [
            'users' => User::with('role') // Ensure the role relationship is eager loaded
                ->search($this->search)
                ->when($this->admin !== '', function ($query) {
                    $query->whereHas('role', function ($subQuery) {
                        $subQuery->where('name', $this->admin);
                    });
                })
                ->orderBy('role_id', $this->sortDir) // Sort by the role_id instead of role.name
                ->paginate($this->perPage)
        ]);
    }
}
