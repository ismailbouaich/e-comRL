<div>
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto my-10">
        <h1 class="text-2xl font-bold mb-4">Create Discount</h1>
    
        <form wire:submit.prevent="createDiscount" class="space-y-4">
            <div class="flex items-center">
                <label for="name" class="w-1/3 block text-sm font-medium text-gray-700">Name:</label>
                <div class="w-2/3">
                    <input type="text" wire:model="name" id="name" name="name" class="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    @error('name')
                        <span class="text-red-500 text-sm">{{ $message }}</span>
                    @enderror
                </div>
            </div>
    
            <div class="flex items-center">
                <label for="code" class="w-1/3 block text-sm font-medium text-gray-700">Code:</label>
                <div class="w-2/3 flex items-center">
                    <input type="text" wire:model="code" id="code" name="code" class="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" readonly>
                    <button wire:click.prevent="generateCode" class="ml-2 px-2 py-1 rounded-md bg-blue-500 text-white font-bold hover:bg-blue-700">Generate</button>
                    @error('code')
                        <span class="text-red-500 text-sm ml-2">{{ $message }}</span>
                    @enderror
                </div>
            </div>
    
            <div class="flex items-center">
                <label for="discount_type" class="w-1/3 block text-sm font-medium text-gray-700">Discount Type:</label>
                <div class="w-2/3">
                    <select wire:model="discount_type" id="discount_type" name="discount_type" class="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="percentage">Percentage</option>
                        <option value="fixed">Fixed Amount</option>
                    </select>
                    @error('discount_type')
                        <span class="text-red-500 text-sm">{{ $message }}</span>
                    @enderror
                </div>
            </div>
    
            <div class="flex items-center">
                <label for="discount_value" class="w-1/3 block text-sm font-medium text-gray-700">Discount Value:</label>
                <div class="w-2/3">
                    <input type="text"  wire:model="discount_value" id="discount_value" name="discount_value" class="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    @error('discount_value')
                        <span class="text-red-500 text-sm">{{ $message }}</span>
                    @enderror
                </div>
            </div>
    
            <div class="flex items-center">
                <label for="start_date" class="w-1/3 block text-sm font-medium text-gray-700">Start Date:</label>
                <div class="w-2/3">
                    <input type="date" wire:model="start_date" id="start_date" name="start_date" class="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    @error('start_date')
                        <span class="text-red-500 text-sm">{{ $message }}</span>
                    @enderror
                </div>
            </div>
            <div class="flex items-center">
                <label for="end_date" class="w-1/3 block text-sm font-medium text-gray-700">End Date:</label>
                <div class="w-2/3">
                    <input type="date" wire:model="end_date" id="end_date" name="end_date" class="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    @error('end_date')
                        <span class="text-red-500 text-sm">{{ $message }}</span>
                    @enderror
                </div>
            </div>
            
            <div class="flex items-center">
                <label for="is_active" class="w-1/3 block text-sm font-medium text-gray-700">Is Active:</label>
                <div class="w-2/3">
                    <input type="checkbox" wire:model="is_active" id="is_active" name="is_active" class="rounded">
                </div>
            </div>
            
            <div class="flex items-center">
                <label for="product_ids" class="w-1/3 block text-sm font-medium text-gray-700">Product IDs:</label>
                <div class="w-2/3">
                    <select wire:model="product_ids" id="product_ids" name="product_ids[]" multiple class="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                        @foreach ($products as $product)
                            <option value="{{ $product->id }}">{{ $product->product_name }}</option>
                        @endforeach
                    </select>
                    @error('product_ids')
                        <span class="text-red-500 text-sm">{{ $message }}</span>
                    @enderror
                </div>
            </div>
            
            <div class="flex justify-end">
                <button type="submit" class="px-4 py-2 rounded-md bg-indigo-600 text-white font-bold hover:bg-indigo-700">Create Discount</button>
            </div>
                </form>
            </div>
            
</div>
