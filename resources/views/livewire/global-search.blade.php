<div class="relative">
    <input 
        type="text" 
        wire:model.live.debounce.300ms="query" 
        placeholder="Search..." 
        class="w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white/80"
    >

    @if (!empty($query) && !empty($results))
        <div class="absolute bg-white shadow-lg rounded-md mt-2 w-full z-10 dark:bg-gray-800 dark:text-white/80">
            @foreach ($results as $type => $items)
                @if ($items->isNotEmpty())
                    <div class="border-b dark:border-black">
                        <h3 class="font-semibold p-2">{{ ucfirst($type) }}</h3>
                        <ul>
                            @foreach ($items as $item)
                                <li class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <a href="{{ route($type . '.show', $item->id) }}">
                                        {{ $item->name ?? $item->customer_name ?? $item->product_name ?? ''?? $item->city ?? '' }}
                                    </a>
                                </li>
                            @endforeach
                        </ul>
                    </div>
                @endif
            @endforeach
        </div>
    @endif
</div>
