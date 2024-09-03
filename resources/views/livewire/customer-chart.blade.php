<div wire:ignore x-data="{ chart: null }" x-init="
    chart = new ApexCharts($refs.chart, @js($options));
    chart.render();
    Livewire.on('refreshChart', newOptions => {
        chart.updateOptions(newOptions);
    });
   
">
    <div x-ref="chart" class="w-full h-64"></div>
</div>