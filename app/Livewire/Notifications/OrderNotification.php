<?php

namespace App\Livewire\Notifications;

use Livewire\Component;
use Illuminate\Support\Facades\Auth;


class OrderNotification extends Component
{
    public $notifications = [];

    protected $listeners = ['notify' => 'addNotification'];

    public function mount()
    {
        $this->notifications = Auth::user()->notifications->take(5);
    }

    public function addNotification($notification)
    {
        array_unshift($this->notifications, $notification);
        if (count($this->notifications) > 5) {
            array_pop($this->notifications);
        }
    }
    public function render()
    {
        return view('livewire.notifications.order-notification');
    }
}
