<div x-data="{ collapsed: false }" class="flex flex-col h-full overflow-hidden text-gray-700 bg-gray-100 rounded transition-all duration-300 ease-in-out dark:bg-gray-800" :class="{ 'w-16': collapsed, 'w-64': !collapsed } ">
  <!-- Collapse button -->
  <a @click="collapsed = !collapsed" class="flex items-center justify-center mt-3 cursor-pointer">
    <img x-show="!collapsed" src="{{ asset('assets/svg/icon1.svg') }}" class="w-8 h-8 text-gray-700" alt="Icon 1">
    
    <!-- SVG when collapsed -->
    <img x-show="collapsed" src="{{ asset('assets/svg/icon2.svg') }}" class="w-8 h-8 " alt="Icon 2">
  </a>

  <!-- Expanded Sidebar Content -->
  <div x-show="!collapsed" class="w-full px-2 transition-opacity duration-300 ease-in-out">
    <div class="flex flex-col items-center w-full mt-3 border-t border-gray-300">
      <x-sidebar-link :href="route('dashboard')" :active="request()->routeIs('dashboard')" wire:navigate>
        
        <img  src="{{ asset('assets/svg/icon3.svg') }}" class="w-6 h-6 stroke-current text-gray-700" alt="Icon 2">

        <span class="ml-2 text-sm font-medium">{{ __('Dashboard') }}</span>
      </x-sidebar-link>

      <!-- Nested Menu for Accounts -->
      <div x-data="{ open: false }" class="w-full">
        <button @click="open = !open" class="flex justify-between items-center w-full h-12 px-3 mt-2 ps-3 pe-4 py-2 border-l-4 border-transparent text-start text-base font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-800 dark:focus:text-gray-200 focus:bg-gray-50 dark:focus:bg-gray-700 focus:border-gray-300 dark:focus:border-gray-600 transition duration-150 ease-in-out">
            <span class="flex items-center">
              <img  src="{{ asset('assets/svg/icon4.svg') }}" class="w-6 h-6" alt="Icon 2">

                <span class="ml-2">{{ __('Tables') }}</span>
            </span>
            <div :class="{ 'rotate-180': open }" class="transform transition-transform duration-300 ease-in-out">
              <img src="{{ asset('assets/svg/icon6.svg') }}" class="h-5 w-5" alt="Icon">
          </div>
        </button>
        <div x-show="open" x-transition:enter="transition ease-out duration-300" x-transition:enter-start="opacity-0 transform scale-95" x-transition:enter-end="opacity-100 transform scale-100" x-transition:leave="transition ease-in duration-300" x-transition:leave-start="opacity-100 transform scale-100" x-transition:leave-end="opacity-0 transform scale-95" class="w-full px-6 py-2 bg-gray-50 dark:bg-gray-700/50">
            <x-sidebar-link :href="route('users')" :active="request()->routeIs('users')" wire:navigate>
                <span class="ml-8 text-sm font-medium">{{ __('users') }}</span>
            </x-sidebar-link>
            <x-sidebar-link :href="route('products')" :active="request()->routeIs('products')" wire:navigate>
                <span class="ml-8 text-sm font-medium">{{ __('products') }}</span>
            </x-sidebar-link>
            <x-sidebar-link :href="route('categories')" :active="request()->routeIs('categories')" wire:navigate>
              <span class="ml-8 text-sm font-medium">{{ __('categories') }}</span>
          </x-sidebar-link>

          <x-sidebar-link :href="route('brands')" :active="request()->routeIs('brands')" wire:navigate>
            <span class="ml-8 text-sm font-medium">{{ __('brands') }}</span>
        </x-sidebar-link>
            <x-sidebar-link :href="route('orders')" :active="request()->routeIs('orders')" wire:navigate>
                <span class="ml-8 text-sm font-medium">{{ __('orders') }}</span>
            </x-sidebar-link>
        </div>
    </div>
    
    </div>
    
    <!--here-->
    <div class="flex flex-col items-center w-full mt-3 border-t border-gray-300">
      <!-- Nested Menu for Accounts -->
      <div x-data="{ open: false }" class="w-full">
        <button @click="open = !open" class="flex justify-between items-center w-full h-12 px-3 mt-2 ps-3 pe-4 py-2 border-l-4 border-transparent text-start text-base font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-800 dark:focus:text-gray-200 focus:bg-gray-50 dark:focus:bg-gray-700 focus:border-gray-300 dark:focus:border-gray-600 transition duration-150 ease-in-out">
            <span class="flex items-center">
              <img  src="{{ asset('assets/svg/icon5.svg') }}" class="w-6 h-6" alt="Icon 2">

                
                <span class="ml-2">{{ __('Roles') }}</span>
            </span>

            <div :class="{ 'rotate-180': open }" class="transform transition-transform duration-300 ease-in-out">
              <img src="{{ asset('assets/svg/icon6.svg') }}" class="h-5 w-5" alt="Icon">
          </div>
        </button>
        <div x-show="open" x-transition:enter="transition ease-out duration-300" x-transition:enter-start="opacity-0 transform scale-95" x-transition:enter-end="opacity-100 transform scale-100" x-transition:leave="transition ease-in duration-300" x-transition:leave-start="opacity-100 transform scale-100" x-transition:leave-end="opacity-0 transform scale-95" class="w-full px-6 py-2 bg-gray-50 dark:bg-gray-700/50">
            <x-sidebar-link :href="route('roles')" :active="request()->routeIs('roles')" wire:navigate>
                <span class="ml-8 text-sm font-medium">{{ __('roles') }}</span>
            </x-sidebar-link>
            <x-sidebar-link :href="route('create.role')" :active="request()->routeIs('create.role')" wire:navigate>
                <span class="ml-8 text-sm font-medium">{{ __('create') }}</span>
            </x-sidebar-link>
          
        </div>
    </div>
    
    </div>
  </div>

  <!-- Collapsed Sidebar Content -->
  <div x-show="collapsed" class="w-full px-2 transition-opacity duration-300 ease-in-out">
    <div class="flex flex-col items-center w-full mt-3 border-t border-gray-300">
      <a href="{{ route('dashboard') }}" class="flex items-center p-4 transition-colors duration-300 ease-in-out hover:bg-gray-200" title="Dashboard">
        <img  src="{{ asset('assets/svg/icon3.svg') }}" class="w-6 h-6 stroke-current text-gray-700" alt="Icon 2">

      </a>
      <a href="{{ route('users') }}" class="flex items-center p-4 transition-colors duration-300 ease-in-out hover:bg-gray-200" title="Users">
        <img  src="{{ asset('assets/svg/icon4.svg') }}" class="w-6 h-6 stroke-current text-gray-700" alt="Icon 2">

      </a>
    </div>
  </div>
  <style>
  [x-cloak] {
    display: none !important;
  }
</style>
</div>
