<div class="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto my-10">
    <form wire:submit.prevent="submit">
      <div class="space-y-12">
        <div class="border-b border-gray-900/10 pb-12">
          <h2 class="text-base font-semibold leading-7 text-gray-900">Show The Selected Product</h2>
          <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div class="sm:col-span-2 sm:col-start-1">
              <label for="product_name" class="block text-sm font-medium leading-6 text-gray-900">Product Name</label>
              <div class="mt-2">
                <input type="text" wire:model="product_name" name="product_name" placeholder="Product Name" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" disabled>
              </div>
            </div>
            <div class="sm:col-span-2">
              <label for="price" class="block text-sm font-medium leading-6 text-gray-900">Price</label>
              <div class="mt-2">
                <input type="number" wire:model="price" name="price" placeholder="Price" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" disabled>
              </div>
            </div>
    
            <div class="sm:col-span-2">
              <label for="stock_quantity" class="block text-sm font-medium leading-6 text-gray-900"> Stock quantity</label>
              <div class="mt-2">
                <input type="number" wire:model="stock_quantity" name="stock_quantity" placeholder="Stock Quantity"class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" disabled>
              </div>
            </div>
            <div class="col-span-full">
              <label for="description" class="block text-sm font-medium leading-6 text-gray-900">Description</label>
              <div class="mt-2">
                <textarea wire:model="description" rows="3" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" disabled></textarea>
              </div>
              <p class="mt-3 text-sm leading-6 text-gray-600">Write a description for the Product.</p>
            </div>
            <div class="sm:col-span-3">
              <label for="categories" class="block text-sm font-medium leading-6 text-gray-900">Categories</label>
              <div class="mt-2">
                <select  wire:model="category_id" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6" disabled>
                   @foreach ($categories as $category)
                    <option value="{{ $category->id }}">{{ $category->name }}</option>
                @endforeach
                </select>
              </div>
            </div>


          <div class="col-span-full">
  <label for="images" class="block text-sm font-medium leading-6 text-gray-900">Images for product</label>
  <div class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
      <div class="text-center">
          <!-- SVG code here -->
              @if(count($images) > 0)
              <div id="image-preview" class="grid-cols-6 mt-4">
              <h3 class="text-lg font-semibold mb-2">Selected Images</h3>
                  <div class="flex space-x-4">
                     
                  </div>
                </div>
              @endif
          
      </div>
  </div>
</div>
          
    </div>
        </div>
      </div>
      <div class="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" class="text-sm font-semibold leading-6 text-gray-900">Cancel</button>
        <button type="submit" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        href="{{ route('products.edit', $product->id) }}" 
        >Edit</button>
        <button type="submit" class="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">Delete</button>

      </div>
    </form>
</div>

