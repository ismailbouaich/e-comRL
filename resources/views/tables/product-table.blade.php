<x-app-layout>
    <x-header-component 
    :breadcrumb="[
        ['label' => 'List', 'url' => '#'], 
        ['label' => 'Products', 'url' => '#']
    ]" 
    button-text="New Product" 
    button-link="create/product"
    :show-button="true" 
/>
    <livewire:tables.products-table/>
</x-app-layout>