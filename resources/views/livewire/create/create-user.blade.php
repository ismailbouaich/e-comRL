<div class="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto my-10">
   <form wire:submit.prevent="submit" method="POST">
      <div class="space-y-12">
        
        <div class="border-b border-gray-900/10 pb-12">
          <h2 class="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
          <p class="mt-1 text-sm leading-6 text-gray-600">Use a permanent address where you can receive mail.</p>
    
          <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div class=" sm:col-span-3">
              <label for="first-name"
               class="block text-sm font-medium leading-6 text-gray-900">User name</label>
              <div class="mt-2">
                <input type="text" wire:model="name" id="name" autocomplete="off" name="name" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
              </div>
              <x-input-error :messages="$errors->get('name')" class="mt-2" />

            </div>

            <div class="sm:col-span-3">
              <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
              <div class="mt-2">
                <input wire:model="email" id="email" type="email" autocomplete="off" name="email" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
              </div>
              <x-input-error :messages="$errors->get('email')" class="mt-2" />

            </div>
    
            <div class="relative sm:col-span-4">
              <label for="street-address" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
              <div class="mt-2">
                <input type="password" wire:model="password" id="password" name="password" autocomplete="off" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
              </div>
              <x-input-error :messages="$errors->get('password')" class="mt-2" />

                <button type="button" wire:click="generatePassword">generatePassword</button>
              </div>

            <div class="sm:col-span-4">
              <label for="password_confirmation" class="block text-sm font-medium leading-6 text-gray-900">Password Confirmation</label>
              <div class="mt-2">
                <input  wire:model="password_confirmation"type="password" name="password_confirmation" id="password_confirmation" placeholder="Confirm Password" autocomplete="off" 
                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
              </div>
              <x-input-error :messages="$errors->get('password_confirmation')" class="mt-2" />

            </div>
          </div>
        </div>
    
        <div class="border-b border-gray-900/10 pb-12">
          <div class="mt-10 space-y-10">
            <fieldset>
               <legend class="text-sm font-semibold leading-6 text-gray-900">Pick a Role For Your User</legend>
               <p class="mt-1 text-sm leading-6 text-gray-600">Select the role that will be assigned to the user.</p>
               <div class="mt-6 space-y-6">
                 @foreach ($roles as $role)
                   <div class="flex items-center gap-x-3">
                     <input id="role-{{ $role->id }}" wire:model="role_id" type="radio" value="{{ $role->id }}" class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600">
                     <label for="role-{{ $role->id }}" class="block text-sm font-medium leading-6 text-gray-900">{{ $role->name }}</label>
                   </div>
                 @endforeach
               </div>
             </fieldset>
          </div>
        </div>
      </div>
    
      <div class="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" class="text-sm font-semibold leading-6 text-gray-900">Cancel</button>
        <button type="submit" wire:loading.attr="disabled" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save</button>
       </div>
    </form>
</div>
