
<x-app-layout>
    <x-header-component 
    :breadcrumb="[
        ['label' => 'List', 'url' => '#'], 
        ['label' => 'Shipping Zones', 'url' => '#']
    ]" 
    button-text="New Shipping Zone" 
    button-link="create/shipping-zone"
    :show-button="true" 
/>
    <livewire:tables.categories-table/>
</x-app-layout>