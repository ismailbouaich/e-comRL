
<x-app-layout>
    <x-header-component 
    :breadcrumb="[
        ['label' => 'List', 'url' => '#'], 
        ['label' => 'Brand', 'url' => '#']
    ]" 
    button-text="New Brand" 
    button-link="create/brand"
    :show-button="true" 
/>
    <livewire:tables.brands-tables/>
</x-app-layout>