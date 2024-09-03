<x-app-layout>
    <div class="grid grid-cols-3 gap-4 p-4 ">
        <livewire:order-count type="revenue" />
        <livewire:order-count type="customers" />
        <livewire:order-count type="orders" />
    </div>
  
  <div class="grid grid-cols-2 gap-4 p-4">
      <!-- Charts -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow dark:text-white mt-4 ">
          <h2 class="text-lg font-semibold">Orders per month</h2>
          <livewire:order-chart />
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow dark:text-white mt-4">
          <h2 class="text-lg font-semibold">Total customers</h2>
          <livewire:customer-chart />
      </div>
     
  </div>
  <livewire:tables.orders-table/>
</x-app-layout>
