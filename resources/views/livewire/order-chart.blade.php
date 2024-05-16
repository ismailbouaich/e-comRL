
    <div>
 
        <div id="order-chart"></div>
       
  
    <script>
        var options = {!! json_encode($options) !!};
        var chart = new ApexCharts(document.querySelector("#order-chart"), options);
        chart.render();
    </script>
  
    </div>
       
   
 
