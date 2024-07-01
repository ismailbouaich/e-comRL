<x-app-layout>
    <x-header-component 
    :breadcrumb="[
        ['label' => 'List', 'url' => '/products'], 
        ['label' => 'Products', 'url' => '/products']
    ]" 
    
    :show-button="false" 
/>
    <livewire:create.create-product/>
</x-app-layout>