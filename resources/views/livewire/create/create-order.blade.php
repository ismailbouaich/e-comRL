<div>
    @if (session()->has('message'))
    <div class="alert alert-success">
        {{ session('message') }}
    </div>
@endif

@if (session()->has('error'))
    <div class="alert alert-danger">
        {{ session('error') }}
    </div>
@endif
    @foreach ($steps as $key => $step)
    <form wire:click.prevent="submitForm">
        <div class="{{ $currentStep === $key ? 'active' : '' }}">
            <h3>{{ $step }}</h3>
            @if ($currentStep === $key)
                @if ($key === 1)
                    <input wire:model.defer="orderData.customer_name" type="text" placeholder="Customer Name">
                    <input wire:model.defer="orderData.customer_id" type="text" placeholder="Customer ID">
                    <input wire:model.defer="orderData.delivery_worker_id" type="text" placeholder="Delivery Worker ID">
                    <input wire:model.defer="orderData.status" type="text" placeholder="status">
                    <input wire:model.defer="orderData.session_id" type="text" placeholder="session_id">
                @elseif ($key === 2)
                    @foreach ($orderDetailsData as $index => $detail)
                        <div>
                            <input wire:model.defer="orderDetailsData.{{ $index }}.product_id" type="text" placeholder="Product ID">
                            <input wire:model.defer="orderDetailsData.{{ $index }}.total_price" type="number" placeholder="Total Price">
                            <input wire:model.defer="orderDetailsData.{{ $index }}.amount" type="text" placeholder="amount">
                            <input wire:model.defer="orderDetailsData.{{ $index }}.city" type="text" placeholder="City">
                            <input wire:model.defer="orderDetailsData.{{ $index }}.address" type="text" placeholder="Address">
                            <input wire:model.defer="orderDetailsData.{{ $index }}.zip_code" type="text" placeholder="Zip Code">
                            <button wire:click.prevent="removeOrderDetail({{ $index }})">Remove Detail</button>
                            
                        </div>
                    @endforeach
                        
                    <button wire:click.prevent="addOrderDetail">Add Order Detail</button>
                @endif

            @endif
            <button   type="button" wire:click.prevent="goToStep({{ $key + 1 }})" @if ($key === count($steps)) disabled @endif>Next</button>
            <button  type="button" wire:click.prevent="goToStep({{ $key - 1 }})" @if ($key === 1) disabled @endif>Previous</button>

            <button type="button">Submit Order</button>


           
        </div>
 
 
    </form>
    @endforeach

    @livewire('map.map', ['orderDetailsData' => $orderDetailsData])

</div>