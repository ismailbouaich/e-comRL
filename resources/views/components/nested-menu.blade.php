@props(['title', 'icon'])

<div x-data="{ open: false }" class="w-full">
    <div @click="open = !open" class="flex items-center justify-between w-full px-4 py-2 mt-2 text-left bg-transparent rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600">
        <div class="flex items-center">
            {!! $icon !!}
            <span class="ml-3 text-sm font-medium">{{ $title }}</span>
        </div>
        <svg x-show="!open" class="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 01.707.293l5 5a1 1 0 11-1.414 1.414L10 5.414 5.707 9.707a1 1 0 11-1.414-1.414l5-5A1 1 0 0110 3z" clip-rule="evenodd" />
        </svg>
        <svg x-show="open" class="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 17a1 1 0 01-.707-.293l-5-5a1 1 0 011.414-1.414L10 14.586l4.293-4.293a1 1 0 011.414 1.414l-5 5A1 1 0 0110 17z" clip-rule="evenodd" />
        </svg>
    </div>
    <div x-show="open" class="mt-2 space-y-2 px-4">
        {{ $slot }}
    </div>
</div>
