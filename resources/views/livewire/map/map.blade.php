<div>
 <div id="map"  wire:ignore x-ref="map" style="width: 800px; height: 600px;"></div>

 
    <script>
        var map;
    var Apikey = 'AtYYJi3Am_4L9G8zblQ4pF6R_AZHZxtXCgErM3gDqjtlKKMvhWNJKF6Mtz8MPg7U';
    
    var mapInitialized = false;
    
    function loadMap() {
      if (!mapInitialized && window.Microsoft && window.Microsoft.Maps && window.Microsoft.Maps.Map)  {
        mapInitialized = true;
        var mapOptions = {
                credentials: Apikey,
                center: new window.Microsoft.Maps.Location(47.60357, -122.35565),
                mapTypeId: window.Microsoft.Maps.MapTypeId.road,
                zoom: 12
            };
            map = new window.Microsoft.Maps.Map(document.getElementById('map'), mapOptions);
            window.Microsoft.Maps.Events.addHandler(map, 'click', handleMapClick);
        }
    }
    
    function handleMapClick(e) {
      const { latitude, longitude } = e.location;
    
      for (let i = map.entities.getLength() - 1; i >= 0; i--) {
          const pushpin = map.entities.get(i);
          if (pushpin instanceof window.Microsoft.Maps.Pushpin) {
              map.entities.removeAt(i);
          }
      }
      const pushpin = new window.Microsoft.Maps.Pushpin(new window.Microsoft.Maps.Location(latitude, longitude), null);
      map.entities.push(pushpin);
    
      const url = `http://dev.virtualearth.net/REST/v1/Locations/${latitude},${longitude}?o=json&key=${Apikey}`;
    
      fetch(url)
      .then(response => response.json())
      .then(data => {
          const addressDetails = data.resourceSets[0].resources[0].address;
    
          console.log('Address Details:', addressDetails);  
          // Dispatch custom event to Livewire with the correct details
                @this.set('orderDetailsData.0.address', addressDetails.addressLine);
                @this.set('orderDetailsData.0.city', addressDetails.locality || addressDetails.adminDistrict2);
                @this.set('orderDetailsData.0.zip_code', addressDetails.postalCode);
      })
      .catch(error => console.error('Error:', error));
    }
    
    document.addEventListener('DOMContentLoaded', function() {
        if (!window.Microsoft) {
            var script = document.createElement('script');
            script.src = `https://www.bing.com/api/maps/mapcontrol?callback=loadMap`;
            script.async = true;
            script.defer = true;
            window.loadMap = loadMap;
            document.body.appendChild(script);
        } else {
          window.addEventListener('reinitialize-map', function () {
            loadMap();  // Ensure this function is idempotent
        });
    
        loadMap(); // Initial load
        }
    
    });
    
    
      </script>
</div>
