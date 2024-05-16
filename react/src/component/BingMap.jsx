import { useEffect, useRef } from 'react';

const BingMap = ({ onLocationSelect }) => {
  const mapRef = useRef(null);
  const Apikey='AtYYJi3Am_4L9G8zblQ4pF6R_AZHZxtXCgErM3gDqjtlKKMvhWNJKF6Mtz8MPg7U';
  let map; // Declare map variable in the outer scope

  useEffect(() => {
    const loadMap = () => {
      if (window.Microsoft && window.Microsoft.Maps && window.Microsoft.Maps.Map && window.Microsoft.Maps.Location) {
        const mapOptions = {
          credentials: `${Apikey}`,
          center: new window.Microsoft.Maps.Location(47.60357, -122.35565),
          mapTypeId: window.Microsoft.Maps.MapTypeId.road,
          zoom: 12
        };
  
        map = new window.Microsoft.Maps.Map(mapRef.current, mapOptions); // Assign map instance to the outer variable
  
        // Add a click event handler to the map
        window.Microsoft.Maps.Events.addHandler(map, 'click', handleMapClick);
      }
    };
  
    if (!window.Microsoft) {
      const script = document.createElement('script');
      script.src = `https://www.bing.com/api/maps/mapcontrol?callback=loadMap`;
      script.async = true;
      script.defer = true;
      window.loadMap = loadMap;
      document.body.appendChild(script);
    } else {
      loadMap();
    }
  }, []);
  
  const handleMapClick = (e) => {
    // Get the latitude and longitude from the event
    const { latitude, longitude } = e.location;

    // Create a pushpin
    for (let i = map.entities.getLength() - 1; i >= 0; i--) {
      const pushpin = map.entities.get(i);
      if (pushpin instanceof window.Microsoft.Maps.Pushpin) {
        map.entities.removeAt(i);
      }
    }
    const pushpin = new window.Microsoft.Maps.Pushpin(new window.Microsoft.Maps.Location(latitude, longitude), null);

    // Add the pushpin to the map
    map.entities.push(pushpin);
  
    // Create the URL for the Bing Maps REST service
    const url = `http://dev.virtualearth.net/REST/v1/Locations/${latitude},${longitude}?o=json&key=${Apikey}`;
  
    // Fetch the data from the Bing Maps REST service
    fetch(url)
      .then(response => response.json())
      .then(data => {
        // The address will be in the first resource in the resources array
        const address = data.resourceSets[0].resources[0].address;
        onLocationSelect(address.formattedAddress, address.postalCode, address.adminDistrict2);        // Log the address and postal code
        console.log('Address:', address.formattedAddress);
        console.log('Postal Code:', address.postalCode);
        console.log('City:', address.adminDistrict2);
        console.log('City:', address);
      })
      .catch(error => console.error('Error:', error));
  };

  return <div ref={mapRef} style={{ width: '100%', height: '500px' }} />;
};

export default BingMap;
