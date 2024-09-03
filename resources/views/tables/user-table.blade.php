<x-app-layout>
    <x-header-component 
    :breadcrumb="[
        ['label' => 'List', 'url' => '#'], 
        ['label' => 'Users', 'url' => '#']
    ]" 
    button-text="New Users" 
    button-link="create/user"
    :show-button="true" 
/>
    <livewire:tables.users-tables/>
</x-app-layout>