<x-app-layout>
    <x-header-component 
    :breadcrumb="[
        ['label' => 'List', 'url' => '/discounts'], 
        ['label' => 'Discount', 'url' => '/discounts']
    ]" 
    
    :show-button="false" 
/>
    <livewire:create.create-discount/>
</x-app-layout>