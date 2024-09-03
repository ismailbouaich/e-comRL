<?php

namespace App\Livewire;

use App\Models\User;
use Livewire\Component;
use Carbon\Carbon;


class CustomerChart extends Component
{
    public function render()
    {
        $options = $this->getCustomerChartOptions();
        return view('livewire.customer-chart', compact('options'));
    }

    private function getCustomerChartOptions()
    {
        $CustomerPerMonth = [];
    for ($month = 1; $month <= 12; $month++) {
        $startDate = Carbon::create(null, $month, 1);
        $endDate = $startDate->copy()->endOfMonth();
        // Fetch customers for the current month
        $customersCount = User::whereHas('role', function ($query) {
            $query->where('name', 'customer');
        })->whereBetween('created_at', [$startDate, $endDate])->count();
        $CustomerPerMonth[] = $customersCount;  
    }

   
   return [
        'series' => [
            [
                'name' => 'Total customers',
                'data' => $CustomerPerMonth
            ],
        ],
        'chart' => [
            'id' => 'customer-chart',
            'type' => 'area',
            'height' => 350,
        ],
        'xaxis' => [
            'categories' => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        ],
        'yaxis' => [
            'tickAmount' => 5,
            'decimalsInFloat' => 0,
        ],
        'dataLabels' => [
            'enabled' => true,
        ],
        'colors' => ['#008FFB'], // Blue color for the area
        'legend' => [
            'show' => true,
            'showForSingleSeries' => true,
            'position' => 'bottom',
            'horizontalAlign' => 'center',
        ],
        'stroke' => [
            'curve' => 'smooth',
        ],
        'tooltip' => [
            'enabled' => true,
        ],
    ];
    }
}
