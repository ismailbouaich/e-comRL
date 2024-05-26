<div class="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto my-10">
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
                                        <input type="text" wire:model.defer="orderData.customer_name" id="customer_name" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Customer Name">
                                    </div>
                                </div>
                                <div class="sm:col-span-2">
                                    <label for="customer_id" class="block text-sm font-medium leading-6 text-gray-900">Customer ID</label>
                                    <div class="mt-2">
                                        <input type="text" wire:model.defer="orderData.customer_id" id="customer_id" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Customer ID">
                                    </div>
                                </div>
                                <div class="sm:col-span-2">
                                    <label for="delivery_worker_id" class="block text-sm font-medium leading-6 text-gray-900">Delivery Worker ID</label>
                                    <div class="mt-2">
                                        <input type="text" wire:model.defer="orderData.delivery_worker_id" id="delivery_worker_id" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Delivery Worker ID">
                                    </div>
                                </div>
                                <div class="sm:col-span-2">
                                    <label for="status" class="block text-sm font-medium leading-6 text-gray-900">Status</label>
                                    <div class="mt-2">
                                        <input type="text" wire:model.defer="orderData.status" id="status" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Status">
                                    </div>
                                </div>
                                <div class="sm:col-span-2">
                                    <label for="session_id" class="block text-sm font-medium leading-6 text-gray-900">Session ID</label>
                                    <div class="mt-2">
                                        <input type="text" wire:model.defer="orderData.session_id" id="session_id" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Session ID">
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
                                        <label for="amount_{{ $index }}" class="block text-sm font-medium leading-6 text-gray-900">Amount</label>
                                        <div class="mt-2">
                                            <input type="text" wire:model.defer="orderDetailsData.{{ $index }}.amount" id="amount_{{ $index }}" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Amount">
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
            <button type="submit" class="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">Submit Order</button>
        </div>
    </form>
    <div>
        <div id="map"  wire:ignore x-ref="map" style="width: 800px; height: 600px;"></div>
       
        
           <script>
               var map;
           var Apikey = 'AtYYJi3Am_4L9G8zblQ4pF6R_AZHZxtXCgErM3gDqjtlKKMvhWNJKF6Mtz8MPg7U';
           
           var mapInitialized = false;
           
           function loadMap() {
             if (!mapInitialized && window.Microsoft && window.Microsoft.Maps && window.Microsoft.Maps.Map)  {
               mapInitialized = true;
               var mapOptions = {
                       credentials: Apikey,
                       center: new window.Microsoft.Maps.Location(47.60357, -122.35565),
                       mapTypeId: window.Microsoft.Maps.MapTypeId.road,
                       zoom: 12
                   };
                   map = new window.Microsoft.Maps.Map(document.getElementById('map'), mapOptions);
                   window.Microsoft.Maps.Events.addHandler(map, 'click', handleMapClick);
               }
           }
           
           function handleMapClick(e) {
             const { latitude, longitude } = e.location;
           
             for (let i = map.entities.getLength() - 1; i >= 0; i--) {
                 const pushpin = map.entities.get(i);
                 if (pushpin instanceof window.Microsoft.Maps.Pushpin) {
                     map.entities.removeAt(i);
                 }
             }
             const pushpin = new window.Microsoft.Maps.Pushpin(new window.Microsoft.Maps.Location(latitude, longitude), null);
             map.entities.push(pushpin);
           
             const url = `http://dev.virtualearth.net/REST/v1/Locations/${latitude},${longitude}?o=json&key=${Apikey}`;
           
             fetch(url)
             .then(response => response.json())
             .then(data => {
                 const addressDetails = data.resourceSets[0].resources[0].address;
           
                 console.log('Address Details:', addressDetails);  
                 // Dispatch custom event to Livewire with the correct details
                       @this.set('orderDetailsData.0.address', addressDetails.addressLine);
                       @this.set('orderDetailsData.0.city', addressDetails.locality || addressDetails.adminDistrict2);
                       @this.set('orderDetailsData.0.zip_code', addressDetails.postalCode);
             })
             .catch(error => console.error('Error:', error));
           }
           
           document.addEventListener('DOMContentLoaded', function() {
               if (!window.Microsoft) {
                   var script = document.createElement('script');
                   script.src = `https://www.bing.com/api/maps/mapcontrol?callback=loadMap`;
                   script.async = true;
                   script.defer = true;
                   window.loadMap = loadMap;
                   document.body.appendChild(script);
               } else {
                 window.addEventListener('reinitialize-map', function () {
                   loadMap();  // Ensure this function is idempotent
               });
           
               loadMap(); // Initial load
               }
           
           });
           
           
             </script>
       </div>
       
</div>
