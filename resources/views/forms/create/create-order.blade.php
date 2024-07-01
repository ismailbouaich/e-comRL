<x-app-layout>
    <x-header-component 
    :breadcrumb="[
        ['label' => 'List', 'url' => '/orders'], 
        ['label' => 'Orders', 'url' => '/orders']
    ]" 
    
    :show-button="false" 
/>
    <livewire:create.create-order/>
</x-app-layout>