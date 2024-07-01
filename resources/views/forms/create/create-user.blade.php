<x-app-layout>
    <x-header-component 
    :breadcrumb="[
        ['label' => 'List', 'url' => '/users'], 
        ['label' => 'Users', 'url' => '/users']
    ]" 
    
    :show-button="false" 
/>
    <livewire:create.create-user/>
</x-app-layout>