import { useState } from 'react';

const BingMapWithSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    if (window.Microsoft && window.Microsoft.Maps && window.Microsoft.Maps.Search) {
      const searchManager = new window.Microsoft.Maps.Search.SearchManager(map);
      const requestOptions = {
        bounds: map.getBounds(),
        where: searchTerm,
        callback: function (answer, userData) {
          map.setView({ bounds: answer.results[0].bestView });
          map.entities.push(new window.Microsoft.Maps.Pushpin(answer.results[0].location));
        },
      };
      searchManager.geocode(requestOptions);
    }
  };

  return (
    <div>
      <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      <button onClick={handleSearch}>Search</button>
      <div id="myMap" style={{ position: 'relative', width: '600px', height: '400px' }}></div>
    </div>
  );
};

export default BingMapWithSearch;
