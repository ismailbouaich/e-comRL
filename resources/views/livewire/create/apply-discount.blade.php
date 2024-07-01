<div>
   <div class="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto my-10">
    <h1 class="text-2xl font-bold mb-4">Apply Discount</h1>

    <form wire:submit.prevent="applyDiscount" class="space-y-4">

        <div class="flex items-center">
            <label for="product_ids" class="w-1/3 block text-sm font-medium text-gray-700">Product IDs:</label>
            <div class="w-2/3">
                <select wire:model="product_ids" id="product_ids" name="product_ids" multiple class="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    @foreach ($products as $product)
                        <option value="{{ $product->id }}">{{ $product->product_name }}</option>
                    @endforeach
                </select>
                                @error('product_ids')
                                    <span class="text-red-500 text-sm">{{ $message }}</span>
                                @enderror
                            </div>
                        </div>
                
                        <div class="flex items-center">
                            <label for="discount_code" class="w-1/3 block text-sm font-medium text-gray-700">Discount Code:</label>
                            <div class="w-2/3">
                                <input type="text" wire:model="discount_code" id="discount_code" name="discount_code" class="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                                @error('discount_code')
                                    <span class="text-red-500 text-sm">{{ $message }}</span>
                                @enderror
                            </div>
                        </div>
                
                        <div class="flex justify-end">
                            <button type="submit" class="px-4 py-2 rounded-md bg-indigo-600 text-white font-bold hover:bg-indigo-700">Apply Discount</button>
                        </div>
                
                        @if (!empty($discountedProducts))
                            <div class="mt-4">
                                <h2 class="text-xl font-bold mb-2">Discounted Products</h2>
                                <table class="w-full rounded-md shadow">
                                    <thead>
                                        <tr>
                                            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Product ID</th>
                                            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Original Price</th>
                                            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Discounted Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        @foreach ($discountedProducts as $product)
                                            <tr>
                                                <td class="px-4 py-2 text-left text-sm font-medium text-gray-700">{{ $product['id'] }}</td>
                                                <td class="px-4 py-2 text-left text-sm font-medium text-gray-700">{{ number_format($product['original_price'], 2) }}</td>
                                                <td class="px-4 py-2 text-left text-sm font-medium text-green-600">{{ number_format($product['discounted_price'], 2) }}</td>
                                            </tr>
                                        @endforeach
                                    </tbody>
                                </table>
                            </div>
                        @endif
                
                    </form>
                </div>
                
   </div>
</div>
