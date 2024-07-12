<div>
    <div id="customer-chart" class=""></div>
       
  
    <script>
       var options = {!! json_encode($options) !!};
var chart = new ApexCharts(document.querySelector("#customer-chart"), options);
chart.render();
    </script>
</div>
