<x-app-layout>
    <x-header-component 
    :breadcrumb="[
        ['label' => 'List', 'url' => '/brands'], 
        ['label' => 'categories', 'url' => '/brands']
    ]" 
    
    :show-button="false" 
/>
    <livewire:create.create-brand/>
</x-app-layout>