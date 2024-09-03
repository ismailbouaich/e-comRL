<div class="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto my-10">
    @if (session()->has('message'))
        <div class="alert alert-success" aria-live="polite">
            {{ session('message') }}
        </div>
    @endif

    @if (session()->has('error'))
        <div class="alert alert-danger" aria-live="polite">
            {{ session('error') }}
        </div>
    @endif

    <div class="flex items-center justify-center space-x-4 my-8">
        @for ($i = 1; $i <= $totalSteps; $i++)
            <div class="flex items-center">
                <div class="rounded-full h-8 w-8 flex items-center justify-center {{ $currentStep >= $i ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600' }}">
                    {{ $i }}
                </div>
                <div class="text-sm ml-2">
                    Step {{ $i }}
                </div>
            </div>
            @if ($i < $totalSteps)
                <div class="flex-grow h-0.5 {{ $currentStep > $i ? 'bg-blue-500' : 'bg-gray-300' }}"></div>
            @endif
        @endfor
    </div>
    <form wire:submit.prevent="submitForm">
        @foreach ($steps as $key => $step)
            <div class="{{ $currentStep === $key ? 'block' : 'hidden' }} space-y-12">
                <div class="border-b border-gray-900/10 pb-12">
                    <h2 class="text-base font-semibold leading-7 text-gray-900">{{ $step }}</h2>
                    @if ($currentStep === $key)
                    @if ($key === 1)
                        <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div class="sm:col-span-2 sm:col-start-1">
                                <label for="customer_name" class="block text-sm font-medium leading-6 text-gray-900">Customer Name</label>
                                <div class="mt-2">
                                    <input type="text" wire:model="orderData.customer_name" id="customer_name" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Customer Name">
                                </div>
                            </div>
                            <div class="sm:col-span-2">
                                <label for="customer_id" class="block text-sm font-medium leading-6 text-gray-900">Customer ID</label>
                                <div class="mt-2">
                                    <input type="text" wire:model="orderData.customer_id" id="customer_id" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Customer ID">
                                </div>
                            </div>
                            <div class="sm:col-span-2">
                                <label for="delivery_worker_id" class="block text-sm font-medium leading-6 text-gray-900">Delivery Worker ID</label>
                                <div class="mt-2">
                                    <input type="text" wire:model="orderData.delivery_worker_id" id="delivery_worker_id" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Delivery Worker ID">
                                </div>
                            </div>
                            <div class="sm:col-span-2">
                                <label for="status" class="block text-sm font-medium leading-6 text-gray-900">Status</label>
                                <div class="mt-2">
                                    <input type="text" wire:model="orderData.status" id="status" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Status">
                                </div>
                            </div>
                            <div class="sm:col-span-2">
                                <label for="session_id" class="block text-sm font-medium leading-6 text-gray-900">Session ID</label>
                                <div class="mt-2 flex">
                                    <input type="text" wire:model="orderData.session_id" id="session_id" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Session ID">
                                    <button type="button" wire:click="generateSessionId" class="ml-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Generate</button>
                                </div>
                            </div>
                        </div>
                    @elseif ($key === 2)
                        @foreach ($orderDetailsData as $index => $detail)
                            <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div class="sm:col-span-2 sm:col-start-1">
                                    <label for="product_id_{{ $index }}" class="block text-sm font-medium leading-6 text-gray-900">Product ID</label>
                                    <div class="mt-2">
                                        <input type="text" wire:model.defer="orderDetailsData.{{ $index }}.product_id" id="product_id_{{ $index }}" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Product ID">
                                    </div>
                                </div>
                                <div class="sm:col-span-2">
                                    <label for="total_price_{{ $index }}" class="block text-sm font-medium leading-6 text-gray-900">Total Price</label>
                                    <div class="mt-2">
                                        <input type="number" wire:model.defer="orderDetailsData.{{ $index }}.total_price" id="total_price_{{ $index }}" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Total Price">
                                    </div>
                                </div>
                                <div class="sm:col-span-2">
                                    <label for="quantity_{{ $index }}" class="block text-sm font-medium leading-6 text-gray-900">Quantity</label>
                                    <div class="mt-2">
                                        <input type="text" wire:model.defer="orderDetailsData.{{ $index }}.quantity" id="quantity_{{ $index }}" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Quantity">
                                    </div>
                                </div>
                                <div class="sm:col-span-2">
                                    <label for="city_{{ $index }}" class="block text-sm font-medium leading-6 text-gray-900">City</label>
                                    <div class="mt-2">
                                        <input type="text" wire:model.defer="orderDetailsData.{{ $index }}.city" id="city_{{ $index }}" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="City">
                                    </div>
                                </div>
                                <div class="sm:col-span-2">
                                    <label for="address_{{ $index }}" class="block text-sm font-medium leading-6 text-gray-900">Address</label>
                                    <div class="mt-2">
                                        <input type="text" wire:model.defer="orderDetailsData.{{ $index }}.address" id="address_{{ $index }}" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Address">
                                    </div>
                                </div>
                                <div class="sm:col-span-2">
                                    <label for="zip_code_{{ $index }}" class="block text-sm font-medium leading-6 text-gray-900">Zip Code</label>
                                    <div class="mt-2">
                                        <input type="text" wire:model.defer="orderDetailsData.{{ $index }}.zip_code" id="zip_code_{{ $index }}" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Zip Code">
                                    </div>
                                </div>
                                <div class="sm:col-span-2">
                                    <button type="button"     x-on:click.prevent="$dispatch('open-modal', 'chose-location')"
                                    class="mt-4 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">chose-location</button>
                                </div>
                                <div class="sm:col-span-2">
                                    <button type="button" wire:click.prevent="removeOrderDetail({{ $index }})" class="mt-4 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">Remove Detail</button>
                                </div>
                            </div>
                        @endforeach
                        <button type="button" wire:click.prevent="addOrderDetail" class="mt-4 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Add Order Detail</button>
                    @endif
                @endif

                    <div class="mt-6 flex items-center justify-end gap-x-6">
                        <button type="button" wire:click.prevent="goToStep({{ $key - 1 }})" @if ($key === 1) disabled @endif class="text-sm font-semibold leading-6 text-gray-900">Previous</button>
                        <button type="button" wire:click.prevent="goToStep({{ $key + 1 }})" @if ($key === count($steps)) disabled @endif class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Next</button>
                    </div>
                </div>
            </div>
        @endforeach

        <div class="mt-6 flex items-center justify-end gap-x-6">
            <x-primary-button>{{ __('Save') }}</x-primary-button>
        </div>
    </form>


    <div>
        <x-modal name="chose-location"  focusable>
           
            <div class="p-2">
                <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {{ __('Are you sure you want to delete your account?') }}
                </h2>
    
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {{ __('Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account.') }}
                </p>
                <div class="mt-2">
                    @livewire('map.map')    
    
                </div>
    <div class="mt-6 flex justify-end">
        <x-secondary-button x-on:click="$dispatch('close')">
            {{ __('Cancel') }}
        </x-secondary-button>
    
       
    </div>
            </div>

        </x-modal>
       
    </div>
    
</div>
