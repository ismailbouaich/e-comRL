
<x-app-layout>
    <x-header-component 
    :breadcrumb="[
        ['label' => 'List', 'url' => '#'], 
        ['label' => 'Categories', 'url' => '#']
    ]" 
    button-text="New Category" 
    button-link="create/category"
    :show-button="true" 
/>
    <livewire:tables.categories-table/>
</x-app-layout>