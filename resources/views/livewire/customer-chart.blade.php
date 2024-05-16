<div>
    <div id="customer-chart"></div>
       
  
    <script>
       var options = {!! json_encode($options) !!};
var chart = new ApexCharts(document.querySelector("#customer-chart"), options);
chart.render();
    </script>
</div>
