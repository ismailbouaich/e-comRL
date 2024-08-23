import { ComboboxDemo } from '../components/ui/combobox';
import React, { useState, useEffect, useRef } from 'react';

const BingMap = ({ onLocationSelect }) => {
  const [searchManager, setSearchManager] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const [options, setOptions] = useState([]);
  const mapInstance = useRef(null);

  const Apikey = 'AtYYJi3Am_4L9G8zblQ4pF6R_AZHZxtXCgErM3gDqjtlKKMvhWNJKF6Mtz8MPg7U';

  useEffect(() => {
    const loadMap = () => {
      if (window.Microsoft && window.Microsoft.Maps) {
        const mapOptions = {
          credentials: Apikey,
          center: new window.Microsoft.Maps.Location(47.60357, -122.35565),
          mapTypeId: window.Microsoft.Maps.MapTypeId.road,
          zoom: 12
        };

        mapInstance.current = new window.Microsoft.Maps.Map(mapRef.current, mapOptions);

        window.Microsoft.Maps.Events.addHandler(mapInstance.current, 'click', handleMapClick);

        window.Microsoft.Maps.loadModule('Microsoft.Maps.Search', () => {
          setSearchManager(new window.Microsoft.Maps.Search.SearchManager(mapInstance.current));
        });
      }
    };

    if (!window.Microsoft) {
      const script = document.createElement('script');
      script.src = `https://www.bing.com/api/maps/mapcontrol?callback=loadMap`;
      script.async = true;
      script.defer = true;
      script.onerror = () => console.error('Failed to load Bing Maps script');
      window.loadMap = loadMap;
      document.body.appendChild(script);
    } else {
      loadMap();
    }
  }, []);

  const handleMapClick = (e) => {
    const { latitude, longitude } = e.location;

    if (mapInstance.current && mapInstance.current.entities) {
      mapInstance.current.entities.clear();
      const pushpin = new window.Microsoft.Maps.Pushpin(new window.Microsoft.Maps.Location(latitude, longitude), null);
      mapInstance.current.entities.push(pushpin);
    }

    const url = `http://dev.virtualearth.net/REST/v1/Locations/${latitude},${longitude}?o=json&key=${Apikey}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const address = data.resourceSets[0].resources[0].address;
        onLocationSelect(address.formattedAddress, address.postalCode, address.adminDistrict2,address.countryRegion);
        console.log('Address:', address.formattedAddress);
        console.log('Postal Code:', address.postalCode);
        console.log('City:', address.adminDistrict2);
        console.log('Country:', address.countryRegion);
      })
      .catch(error => console.error('Error:', error));
  };

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
          small: result.address.adminDistrict2
        }));
        
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