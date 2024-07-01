<?php

namespace App\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class HeaderComponent extends Component
{

    public $breadcrumb;
    public $buttonText;
    public $buttonLink;
    public $showButton;

    /**
     * Create a new component instance.
     */
    public function __construct($breadcrumb, $buttonText = null, $buttonLink = null, $showButton = true)
    {
        $this->breadcrumb = $breadcrumb;
        $this->buttonText = $buttonText;
        $this->buttonLink = $buttonLink;
        $this->showButton = $showButton;

        
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        return view('components.header-component');
    }
}
