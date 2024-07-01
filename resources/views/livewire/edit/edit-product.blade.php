<div class="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto my-10">
  <style>
      .remove-button {
          position: absolute;
          top: 0;
          right: 0;
          background-color: rgba(128, 128, 128, 0.5); /* Gray with 50% opacity */
          color: black;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: bold;
      }

      .remove-button:hover {
          background-color: rgba(128, 128, 128, 0.8); /* Gray with 80% opacity on hover */
          cursor: pointer;
      }
  </style>

  <form wire:submit.prevent="save">
      <div class="space-y-12">
          <div class="border-b border-gray-900/10 pb-12">
              <h2 class="text-base font-semibold leading-7 text-gray-900">Edit Product</h2>
              <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div class="sm:col-span-2 sm:col-start-1">
                      <label for="product_name" class="block text-sm font-medium leading-6 text-gray-900">Product Name</label>
                      <div class="mt-2">
                          <input type="text" wire:model="product_name" name="product_name" placeholder="Product Name"
                              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                      </div>
                  </div>
                  <div class="sm:col-span-2">
                      <label for="price" class="block text-sm font-medium leading-6 text-gray-900">Price</label>
                      <div class="mt-2">
                          <input type="number" wire:model="price" name="price" placeholder="Price"
                              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                      </div>
                  </div>
                  <div class="sm:col-span-2">
                      <label for="stock_quantity" class="block text-sm font-medium leading-6 text-gray-900">Stock
                          Quantity</label>
                      <div class="mt-2">
                          <input type="number" wire:model="stock_quantity" name="stock_quantity"
                              placeholder="Stock Quantity"
                              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                      </div>
                  </div>
                  <div class="col-span-full">
                      <label for="description" class="block text-sm font-medium leading-6 text-gray-900">Description</label>
                      <div class="mt-2">
                          <textarea wire:model="description" rows="3"
                              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></textarea>
                      </div>
                      <p class="mt-3 text-sm leading-6 text-gray-600">Write a description for the Product.</p>
                  </div>
                  <div class="sm:col-span-3">
                      <label for="categories" class="block text-sm font-medium leading-6 text-gray-900">Categories</label>
                      <div class="mt-2">
                          <select wire:model="category_id"
                              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                              @foreach ($categories as $category)
                                  <option value="{{ $category->id }}">{{ $category->name }}</option>
                              @endforeach
                          </select>
                      </div>
                  </div>
                  <div class="col-span-full">
                      <label for="newImages" class="block text-sm font-medium leading-6 text-gray-900">Images for
                          product</label>
                      <div class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                          <div class="text-center">
                              <div class="mt-4 flex text-sm leading-6 text-gray-600">
                                  <label for="newImages"
                                      class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                                      <span>Upload Image(s)</span>
                                      <input id="newImages" name="newImages" wire:model="newImages" type="file"
                                          class="sr-only" multiple>
                                  </label>
                                  <p class="pl-1">or drag and drop</p>
                              </div>
                              <p class="text-xs leading-5 text-gray-600 mt-2">PNG, JPG, up to 10MB</p>

                              <!-- Display old images -->
                              @if(count($images) > 0)
                                  <div id="old-image-preview" class="grid-cols-6 mt-4">
                                      <h3 class="text-lg font-semibold mb-2">Current Images</h3>
                                      <div class="flex space-x-4">
                                          @foreach($images as $image)
                                              <div class="relative">
                                                  <img src="{{ asset('storage/' . $image->file_path) }}"
                                                      class="w-32 h-auto object-cover rounded-lg">
                                                  <button type="button" wire:click="removeImage({{ $image->id }})"
                                                      class="remove-button">X</button>
                                              </div>
                                          @endforeach
                                      </div>
                                  </div>
                              @endif

                              <!-- Display new images -->
                              @if(count($newImages) > 0)
                                  <div id="new-image-preview" class="grid-cols-6 mt-4">
                                      <h3 class="text-lg font-semibold mb-2">New Images</h3>
                                      <div class="flex space-x-4">
                                          @foreach($newImages as $image)
                                              <div class="relative">
                                                  <img src="{{ $image->temporaryUrl() }}"
                                                      class="w-32 h-auto object-cover rounded-lg">
                                                  <button type="button" wire:click="removeNewImage({{ $loop->index }})"
                                                      class="remove-button">X</button>
                                              </div>
                                          @endforeach
                                      </div>
                                  </div>
                              @endif
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <div class="mt-6 flex items-center justify-end gap-x-6">
              <button type="button" class="text-sm font-semibold leading-6 text-gray-900">Cancel</button>
              <button type="submit"
                  class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save</button>
          </div>
      </div>
  </form>
</div>
