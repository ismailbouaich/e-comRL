
<x-app-layout>
    <x-header-component 
    :breadcrumb="[
        ['label' => 'List', 'url' => '#'], 
        ['label' => 'Discounts', 'url' => '#']
    ]" 
    button-text="New Discount" 
    button-link="create/discount"
    :show-button="true" 
/>
    <livewire:tables.categories-table/>
</x-app-layout>