<x-app-layout>
    <x-header-component 
    :breadcrumb="[
        ['label' => 'List', 'url' => '#'], 
        ['label' => 'Orders', 'url' => '#']
    ]" 
    button-text="New Order" 
    button-link="create/order"
    :show-button="true" 
/>
    <livewire:tables.orders-table/>
</x-app-layout>