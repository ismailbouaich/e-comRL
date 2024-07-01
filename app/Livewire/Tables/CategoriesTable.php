<?php

namespace App\Livewire\Tables;

use App\Models\Category;
use Livewire\Component;
use Livewire\Attributes\Url;
use Livewire\WithPagination;

class CategoriesTable extends Component
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

    public function delete(Category $category){
        $category->delete();
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
    
        return view('livewire.tables.categories-table',[
            'categories' => Category::search($this->search)
            // ->when($this->admin !== '',function($query){
            //     $query->where('name',$this->admin);
            // })
            ->orderBy($this->sortBy,$this->sortDir)
            ->paginate($this->perPage)
        ]);
    }
}
