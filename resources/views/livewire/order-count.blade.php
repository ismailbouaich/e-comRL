<div class="bg-white rounded-lg p-4 shadow text-black relative overflow-hidden dark:bg-gray-800 dark:text-white ">
    <h2 class="text-sm font-semibold mb-1">{{ $type === 'revenue' ? 'Revenue' : ($type === 'customers' ? 'New customers' : 'New orders') }}</h2>
    <div class="text-3xl font-bold mb-2">
        @if($type === 'revenue')
            ${{ $this->formattedCounter() }}
        @else
            {{ $this->formattedCounter() }}
        @endif
    </div>
    <div class="flex items-center text-xs">
        <span class="{{ $trend === 'increase' ? 'text-green-400' : 'text-red-400' }} mr-2">
            {{ abs(round($percentageChange)) }}% {{ $trend }}
            <svg class="inline-block w-3 h-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                @if($trend === 'increase')
                    <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                @else
                    <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                @endif
            </svg>
        </span>
        <svg class="w-30 h-10 mt-1">
            <polyline
                fill="none"
                stroke="{{ $trend === 'increase' ? '#4ade80' : '#f87171' }}"
                stroke-width="1.5"
                points="{{ $this->generateSparklinePoints() }}"
            />
        </svg>
    </div>
    <!-- Bottom border that matches the trend -->
    <div class="absolute bottom-0 left-0 right-0 h-1 {{ $trend === 'increase' ? 'bg-green-400' : 'bg-red-400' }}"></div>
</div>