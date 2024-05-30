<div class="relative">
    <input 
        type="text" 
        wire:model.live.debounce.300ms="query" 
        placeholder="Search..." 
        class="w-full p-2 border rounded-md"
    >

    @if (!empty($query) && !empty($results))
        <div class="absolute bg-white shadow-lg rounded-md mt-2 w-full z-10">
            @foreach ($results as $type => $items)
                @if ($items->isNotEmpty())
                    <div class="border-b">
                        <h3 class="font-semibold p-2">{{ ucfirst($type) }}</h3>
                        <ul>
                            @foreach ($items as $item)
                                <li class="p-2 hover:bg-gray-100">
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
