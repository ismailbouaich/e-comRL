<x-app-layout>
    <x-header-component 
    :breadcrumb="[
        ['label' => 'List', 'url' => '/categories'], 
        ['label' => 'Discount', 'url' => '/categories']
    ]" 
    
    :show-button="false" 
/>
    <livewire:create.create-discount/>
</x-app-layout>