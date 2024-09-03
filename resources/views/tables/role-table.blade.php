<x-app-layout>
    <x-header-component 
    :breadcrumb="[
        ['label' => 'List', 'url' => '#'], 
        ['label' => 'Roles', 'url' => '#']
    ]" 
    button-text="New Role" 
    button-link="create/role"
    :show-button="true" 
/>
    <livewire:tables.roles-table/>
</x-app-layout>