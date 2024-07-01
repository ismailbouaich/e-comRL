<x-app-layout>
  <div class="grid grid-cols-3 gap-4 p-4">
      <!-- Summary Cards -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow dark:text-white">
          <h2 class="text-lg font-semibold">Revenue</h2>
          <livewire:order-count />
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow dark:text-white">
          <h2 class="text-lg font-semibold">New Customers</h2>
          <livewire:order-count />
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow dark:text-white">
          <h2 class="text-lg font-semibold">New Orders</h2>
          <livewire:order-count />
      </div>
  </div>
  
  <div class="grid grid-cols-2 gap-4 p-4">
      <!-- Charts -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow dark:text-white mt-4">
          <h2 class="text-lg font-semibold">Orders per month</h2>
          <livewire:order-chart />
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow dark:text-white mt-4">
          <h2 class="text-lg font-semibold">Total customers</h2>
          <livewire:customer-chart />
      </div>
  </div>
</x-app-layout>
