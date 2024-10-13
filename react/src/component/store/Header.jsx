import PropTypes from 'prop-types';


const Header = ({ searchKey, handleInputChange, sortOption, handleSortChange }) => {
  return (
    <div className="flex justify-between mb-4">
      <div className="search-bar flex items-center space-x-2">
        <input
          type="text"
          onChange={handleInputChange}
          value={searchKey}
          placeholder="Search products..."
          className="border border-gray-300 p-2 rounded-lg w-64"
        />
      </div>
      <div className="flex gap-2">
        <button
          className={`p-2 rounded ${sortOption === 'all' ? 'bg-black text-white' : 'border'}`}
          onClick={() => handleSortChange('all')}
        >
          All
        </button>
        <button
          className={`p-2 rounded ${sortOption === 'new' ? 'bg-black text-white' : 'border'}`}
          onClick={() => handleSortChange('new')}
        >
          New
        </button>
        <button
          className={`p-2 rounded ${sortOption === 'price_asc' ? 'bg-black text-white' : 'border'}`}
          onClick={() => handleSortChange('price_asc')}
        >
          Price ascending
        </button>
        <button
          className={`p-2 rounded ${sortOption === 'price_desc' ? 'bg-black text-white' : 'border'}`}
          onClick={() => handleSortChange('price_desc')}
        >
          Price descending
        </button>
      </div>
    </div>
  );
};

Header.propTypes = {
    searchKey: PropTypes.string.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    sortOption: PropTypes.string.isRequired,
    handleSortChange: PropTypes.func.isRequired,
  };

export default Header;
