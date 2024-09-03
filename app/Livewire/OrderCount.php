<?php

namespace App\Livewire;

use App\Models\Order;
use App\Models\OrderDetail;
use Livewire\Component;
use Carbon\Carbon;

class OrderCount extends Component
{
    public $counter = 0;
    public $type = 'orders';
    public $percentageChange = 0;
    public $trend = 'increase';
    public $sparklineData = [];

    public function mount($type = 'orders')
    {
        $this->type = $type;
    }

    public function counter()
    {
        $now = Carbon::now();
        $thirtyDaysAgo = $now->copy()->subDays(30);
        $sixtyDaysAgo = $now->copy()->subDays(60);

        switch($this->type) {
            case 'revenue':
                $this->counter = OrderDetail::where('created_at', '>=', $thirtyDaysAgo)->sum('total_price');
                $previousPeriodRevenue = OrderDetail::whereBetween('created_at', [$sixtyDaysAgo, $thirtyDaysAgo])->sum('total_price');
                break;
            case 'customers':
                $this->counter = Order::where('created_at', '>=', $thirtyDaysAgo)->distinct('customer_id')->count('customer_id');
                $previousPeriodCustomers = Order::whereBetween('created_at', [$sixtyDaysAgo, $thirtyDaysAgo])->distinct('customer_id')->count('customer_id');
                break;
            case 'orders':
                $this->counter = Order::where('created_at', '>=', $thirtyDaysAgo)->count();
                $previousPeriodOrders = Order::whereBetween('created_at', [$sixtyDaysAgo, $thirtyDaysAgo])->count();
                break;
        }

        // Calculate percentage change
        $previousPeriodValue = ${'previousPeriod' . ucfirst($this->type)};
        $this->percentageChange = $previousPeriodValue != 0 ? (($this->counter - $previousPeriodValue) / $previousPeriodValue) * 100 : 0;
        $this->trend = $this->percentageChange >= 0 ? 'increase' : 'decrease';

        // Generate real sparkline data
        $this->sparklineData = $this->generateSparklineData();
    }

    private function generateSparklineData()
    {
        $data = [];
        $now = Carbon::now();
        for ($i = 29; $i >= 0; $i--) {
            $date = $now->copy()->subDays($i);
            switch($this->type) {
                case 'revenue':
                    $value = OrderDetail::whereDate('created_at', $date)->sum('total_price');
                    break;
                case 'customers':
                    $value = Order::whereDate('created_at', $date)->distinct('customer_id')->count('customer_id');
                    break;
                case 'orders':
                    $value = Order::whereDate('created_at', $date)->count();
                    break;
            }
            $data[] = $value;
        }
        return $data;
    }

    public function generateSparklinePoints()
    {
        $width = 120;
        $height = 40;
        $points = [];
        $max = max($this->sparklineData);
        $min = min($this->sparklineData);
        $range = $max - $min;
        $step = $width / (count($this->sparklineData) - 1);

        foreach ($this->sparklineData as $index => $value) {
            $x = $index * $step;
            $y = $height - (($value - $min) / $range) * $height;
            $points[] = "$x,$y";
        }

        return implode(' ', $points);
    }

    public function formattedCounter()
    {
        return number_format($this->counter / 1000, 2) . 'k';
    }

    public function render()
    {
        $this->counter();
        
        return view('livewire.order-count');
    }
}