<div class="">
 <div id="map"  wire:ignore x-ref="map" style="width: 650px; height: 500px;"></div>

 
 <script>
    document.addEventListener('livewire:initialized', function() {
        console.log('Livewire initialized');
        var map;
        var Apikey = 'AtYYJi3Am_4L9G8zblQ4pF6R_AZHZxtXCgErM3gDqjtlKKMvhWNJKF6Mtz8MPg7U';
        var mapInitialized = false;

        function loadMap() {
            if (!mapInitialized && window.Microsoft && window.Microsoft.Maps && window.Microsoft.Maps.Map) {
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
            const latitude = e.location.latitude;
            const longitude = e.location.longitude;

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

                    // Emit Livewire event to update component state
                    console.log('Emitting updateAddress event');
                    console.log('Livewire:', addressDetails);

                    
                    Livewire.dispatch('updateAddress', { address: addressDetails.addressLine,
                        city:addressDetails.adminDistrict2,
                        zipCode:addressDetails.postalCode,
                        longitude:longitude,
                        latitude:latitude
                     });

               
                     

                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Failed to fetch address details. Please try again.');
                });
        }


        const handleSearch = (searchQuery) => {
    if (searchManager && mapInstance.current) {
      const searchRequest = {
        where: searchQuery,
        callback: function (r) {
          if (r && r.results && r.results.length > 0) {
            const firstResult = r.results[0];
            mapInstance.current.setView({ bounds: firstResult.bestView });

            mapInstance.current.entities.clear();
            const pushpin = new window.Microsoft.Maps.Pushpin(firstResult.location);
            mapInstance.current.entities.push(pushpin);

            const location = firstResult.location;
            const url = `https://dev.virtualearth.net/REST/v1/Locations/${location.latitude},${location.longitude}?o=json&key=${Apikey}`;

            fetch(url)
              .then(response => response.json())
              .then(data => {
                const addressDetails = data.resourceSets[0].resources[0].address;
                Livewire.dispatch('updateAddress', { 
                    address: addressDetails.addressLine,
                    city:addressDetails.adminDistrict2,
                    zipCode:addressDetails.postalCode,
                    latitude:addressDetails.location.latitude,
                    longitude:addressDetails.location.longitude 
                });

                console.log(location.longitude );
              })
              .catch(error => {
                setError(error);
              });
          }
        },
        errorCallback: function (e) {
          setError(e);
        }
      };
      searchManager.geocode(searchRequest);
    }
  };


        if (!window.Microsoft) {
            var script = document.createElement('script');
            script.src = `https://www.bing.com/api/maps/mapcontrol?callback=loadMap`;
            script.async = true;
            script.defer = true;
            window.loadMap = loadMap;
            document.body.appendChild(script);
        } else {
            loadMap();
        }
    });
</script>
</div>
