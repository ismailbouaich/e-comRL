<div>
   
    <div>
        <h2 class="text-2xl font-bold mb-4">Edit Order</h2>
    
        <div class="mb-4">
            <div class="flex justify-between">
                @for ($i = 1; $i <= $totalSteps; $i++)
                    <div class="text-center">
                        <div class="rounded-full h-12 w-12 flex items-center justify-center {{ $i <= $currentStep ? 'bg-blue-500 text-white' : 'bg-gray-300' }}">
                            {{ $i }}
                        </div>
                        <div class="mt-2">Step {{ $i }}</div>
                    </div>
                    @if ($i < $totalSteps)
                        <div class="border-t-2 flex-1 my-auto {{ $i < $currentStep ? 'border-blue-500' : 'border-gray-300' }}"></div>
                    @endif
                @endfor
            </div>
        </div>
    
        <form wire:submit.prevent="updateOrder">
            @if ($currentStep == 1)
                <div>
                    <h3 class="text-xl font-semibold mb-3">Basic Order Information</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label for="first_name">First Name</label>
                            <input type="text" id="first_name" wire:model="first_name" class="form-input mt-1 block w-full">
                            @error('first_name') <span class="text-red-500">{{ $message }}</span> @enderror
                        </div>
                        <div>
                            <label for="last_name">Last Name</label>
                            <input type="text" id="last_name" wire:model="last_name" class="form-input mt-1 block w-full">
                            @error('last_name') <span class="text-red-500">{{ $message }}</span> @enderror
                        </div>
                        <!-- Add other fields for step 1 -->
                    </div>
                </div>
            @elseif ($currentStep == 2)
                <div>
                    <h3 class="text-xl font-semibold mb-3">Order Details</h3>
                    @foreach ($orderDetailsData as $index => $detail)
                        <div class="border p-4 mb-4 rounded">
                            <h4 class="font-semibold mb-2">Product {{ $index + 1 }}</h4>
                            <div class="grid grid-cols-3 gap-4">
                                <div>
                                    <label for="product_id_{{ $index }}">Product ID</label>
                                    <input type="number" id="product_id_{{ $index }}" wire:model="orderDetailsData.{{ $index }}.product_id" class="form-input mt-1 block w-full">
                                    @error("orderDetailsData.{$index}.product_id") <span class="text-red-500">{{ $message }}</span> @enderror
                                </div>
                                <!-- Add other fields for order details -->
                            </div>
                            <button type="button" wire:click="removeOrderDetail({{ $index }})" class="mt-2 bg-red-500 text-white px-4 py-2 rounded">Remove</button>
                        </div>
                    @endforeach
                    <button type="button" wire:click="addOrderDetail" class="bg-green-500 text-white px-4 py-2 rounded">Add Product</button>
                </div>
            @elseif ($currentStep == 3)
                <div>
                    <h3 class="text-xl font-semibold mb-3">Shipping Information</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label for="shipping_cost">Shipping Cost</label>
                            <input type="number" id="shipping_cost" wire:model="shipping_cost" class="form-input mt-1 block w-full" step="0.01">
                            @error('shipping_cost') <span class="text-red-500">{{ $message }}</span> @enderror
                        </div>
                        <!-- Add other shipping fields -->
                    </div>
                </div>
            @endif
    
            <div class="mt-6 flex justify-between">
                @if ($currentStep > 1)
                    <button type="button" wire:click="previousStep" class="bg-gray-300 text-gray-700 px-4 py-2 rounded">Previous</button>
                @else
                    <div></div>
                @endif
    
                @if ($currentStep < $totalSteps)
                    <button type="button" wire:click="nextStep" class="bg-blue-500 text-white px-4 py-2 rounded">Next</button>
                @else
                    <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded">Update Order</button>
                @endif
            </div>
        </form>
    </div>

</div>
