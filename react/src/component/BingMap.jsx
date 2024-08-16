import { ComboboxDemo } from '../components/ui/combobox';
import React, { useState, useEffect, useRef } from 'react';

const BingMap = ({ onLocationSelect }) => {
  const [map, setMap] = useState(null);
  const [searchManager, setSearchManager] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const [options, setOptions] = useState([]);

  
  const Apikey = 'AtYYJi3Am_4L9G8zblQ4pF6R_AZHZxtXCgErM3gDqjtlKKMvhWNJKF6Mtz8MPg7U';

  useEffect(() => {
    loadMap();
  }, []);

  const loadMap = () => {
    if (!window.Microsoft) {
      const script = document.createElement('script');
      script.src = `https://www.bing.com/api/maps/mapcontrol?callback=loadMap`;
      script.async = true;
      script.defer = true;
      window.loadMap = loadMap;
      document.body.appendChild(script);
    } else {
      loadMapModule();
    }
  };

  const loadMapModule = () => {
    const mapOptions = {
      credentials: Apikey,
      center: new window.Microsoft.Maps.Location(47.60357, -122.35565),
      mapTypeId: window.Microsoft.Maps.MapTypeId.road,
      zoom: 12
    };

    const mapInstance = new window.Microsoft.Maps.Map(mapRef.current, mapOptions);
    setMap(mapInstance);

    window.Microsoft.Maps.Events.addHandler(mapInstance, 'click', handleMapClick);

    window.Microsoft.Maps.loadModule('Microsoft.Maps.Search', () => {
      setSearchManager(new window.Microsoft.Maps.Search.SearchManager(mapInstance));
    });
  };

  const handleMapClick = (e) => {
    if (!map) return;

    const { latitude, longitude } = e.location;

    // Clear existing pushpins
    map.entities.clear();

    // Add new pushpin
    const pushpin = new window.Microsoft.Maps.Pushpin(new window.Microsoft.Maps.Location(latitude, longitude), null);
    map.entities.push(pushpin);

    // Fetch location details
    const url = `https://dev.virtualearth.net/REST/v1/Locations/${latitude},${longitude}?o=json&key=${Apikey}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const address = data.resourceSets[0].resources[0].address;
        onLocationSelect(address.formattedAddress, address.postalCode, address.adminDistrict2);
      })
      .catch(error => {
        setError(error);
      });
  };

  const handleSearch = (searchQuery) => {
    if (searchManager && map) {
      const searchRequest = {
        where: searchQuery,
        callback: function (r) {
          if (r && r.results && r.results.length > 0) {
            const firstResult = r.results[0];
            map.setView({ bounds: firstResult.bestView });

            map.entities.clear();
            const pushpin = new window.Microsoft.Maps.Pushpin(firstResult.location);
            map.entities.push(pushpin);

            // Get the location details
            const location = firstResult.location;
            const url = `https://dev.virtualearth.net/REST/v1/Locations/${location.latitude},${location.longitude}?o=json&key=${Apikey}`;

            fetch(url)
              .then(response => response.json())
              .then(data => {
                const address = data.resourceSets[0].resources[0].address;
                onLocationSelect(address.formattedAddress, address.postalCode, address.adminDistrict2);
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

  useEffect(() => {
    if (searchQuery) {
      const fetchOptions = async () => {
        const url = `https://dev.virtualearth.net/REST/v1/Locations?q=${encodeURIComponent(searchQuery)}&key=${Apikey}`;
        const response = await fetch(url);
        const data = await response.json();
        const results = data.resourceSets[0].resources;
        const options = results.map((result) => ({
          value: result.address.formattedAddress,
          label: result.address.formattedAddress,
          small:result.address.adminDistrict2
        }));
        
        // Filter out duplicates
        const uniqueOptions = options.filter((option, index, self) =>
          index === self.findIndex((t) => t.label === option.label)
        );
        
        setOptions(uniqueOptions);
      };
      fetchOptions();
    }
  }, [searchQuery]);

  return (
    <div>

      <div style={{ marginBottom: '10px' }}>


      <ComboboxDemo
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
          options={options}
        />
      </div>
      {error && <div style={{ color: 'red' }}>{error.message}</div>}
      <div ref={mapRef} style={{ width: '100%', height: '500px' }} />
    </div>
  );
};

export default BingMap;