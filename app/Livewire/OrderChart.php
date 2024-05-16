<?php

namespace App\Livewire;

use Carbon\Carbon;
use App\Models\Order;
use Livewire\Component;

class OrderChart extends Component
{
    public $thisWeekOrders;
    public $lastWeekOrders;

    public $thisMonthOrders;
    public $lastMonthOrders;

    public function mount()
    {
       
    }


    public function getOrders($startDate, $endDate , $status)
    {
        // Replace this with your actual logic to fetch orders from the database
        // based on the provided date range. You can use Eloquent or any other ORM method.
       return Order::where('status', 'LIKE', '%' . $status . '%')
        ->whereBetween('created_at', [$startDate, $endDate])
        ->count();
  
    }

    public function render()
    {
        $options = $this->getOrderChartOptions();
        return view('livewire.order-chart', compact('options'));
    }
    private function getOrderChartOptions()
    {
        $paidOrdersPerMonth = [];
        $notCompleteOrdersPerMonth = [];
        for ($month = 1; $month <= 12; $month++) {
            $startDate = Carbon::create(null, $month, 1);
            $endDate = $startDate->copy()->endOfMonth();
            $paidOrdersPerMonth[] = $this->getOrders($startDate, $endDate, 'paid');
            $notCompleteOrdersPerMonth[] = $this->getOrders($startDate, $endDate, 'not_complete');
        }
    
        return [
            'series' => [
                [
                    'name' => 'Paid Orders',
                    'data' => $paidOrdersPerMonth
                ],
                [
                    'name' => 'Not Complete Orders',
                    'data' => $notCompleteOrdersPerMonth
                ],
            ],
            'chart' => [
                'type' => 'area',
                'height' => 350,
            ],
            'xaxis' => [
                'categories' => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            ],
        ];
    }

}
