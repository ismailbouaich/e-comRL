<x-app-layout>
    <x-header-component 
    :breadcrumb="[
        ['label' => 'List', 'url' => '/categories'], 
        ['label' => 'categories', 'url' => '/categories']
    ]" 
    
    :show-button="false" 
/>
    <livewire:create.create-brand/>
</x-app-layout>