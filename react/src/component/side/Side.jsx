import { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { AiOutlineClose } from 'react-icons/ai';

import {
  selectCategories,
  selectLoading as selectCategoriesLoading,
  selectError as selectCategoriesError,
} from '../../redux/selectors/categorySelectors';
import {
  selectBrands,
  selectLoading as selectBrandsLoading,
  selectError as selectBrandsError,
} from '../../redux/selectors/brandSelectors';

const Sidebar = ({ onFilterChange, selectedCategories, selectedBrands, priceRange }) => {
  const categories = useSelector(selectCategories) || [];
  const categoriesLoading = useSelector(selectCategoriesLoading);
  const categoriesError = useSelector(selectCategoriesError);

  const brands = useSelector(selectBrands) || [];
  const brandsLoading = useSelector(selectBrandsLoading);
  const brandsError = useSelector(selectBrandsError);

  const [localPriceRange, setLocalPriceRange] = useState([priceRange.min, priceRange.max]);

 
  const handleCheckboxChange = (event, type, keyword) => {
    const { checked } = event.target;

    const updateState = (prevSelected) => {
      if (checked) {
        return [...prevSelected, keyword];
      } else {
        return prevSelected.filter((item) => item !== keyword);
      }
    };

    if (type === 'category') {
      const newSelectedCategories = updateState(selectedCategories);
      onFilterChange({ selectedCategories: newSelectedCategories, selectedBrands, priceRange });
    } else if (type === 'brand') {
      const newSelectedBrands = updateState(selectedBrands);
      onFilterChange({ selectedCategories, selectedBrands: newSelectedBrands, priceRange });
    }
  };

  const handleKeywordRemove = (type, keyword) => {
    if (type === 'category') {
      const newSelectedCategories = selectedCategories.filter((item) => item !== keyword);
      onFilterChange({ selectedCategories: newSelectedCategories, selectedBrands, priceRange });
    } else if (type === 'brand') {
      const newSelectedBrands = selectedBrands.filter((item) => item !== keyword);
      onFilterChange({ selectedCategories, selectedBrands: newSelectedBrands, priceRange });
    }
  };

  const renderKeywords = () => {
    const categoryKeywords = selectedCategories.map((keyword) => (
      <span key={`category-${keyword}`} className="bg-gray-200 px-2 py-1 rounded-full mr-2 mb-2 flex items-center">
        {keyword}
        <button
          className="ml-1 text-gray-500 hover:text-gray-700"
          onClick={() => handleKeywordRemove('category', keyword)}
        >
          <AiOutlineClose size={12} />
        </button>
      </span>
    ));

    const brandKeywords = selectedBrands.map((keyword) => (
      <span key={`brand-${keyword}`} className="bg-gray-200 px-2 py-1 rounded-full mr-2 mb-2 flex items-center">
        {keyword}
        <button
          className="ml-1 text-gray-500 hover:text-gray-700"
          onClick={() => handleKeywordRemove('brand', keyword)}
        >
          <AiOutlineClose size={12} />
        </button>
      </span>
    ));

    return [...categoryKeywords, ...brandKeywords];
  };

  const handlePriceChange = (newRange) => {
    setLocalPriceRange(newRange);
    // Do not call onFilterChange here
  };

  const handlePriceAfterChange = (newRange) => {
    onFilterChange({
      selectedCategories,
      selectedBrands,
      priceRange: { min: newRange[0], max: newRange[1] },
    });
  };

  return (
    <div className="w-1/4 p-4">
      {/* Selected Filters */}
      {(selectedCategories.length > 0 || selectedBrands.length > 0) && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Selected Filters</h3>
          <div className="flex flex-wrap">
            {renderKeywords()}
          </div>
        </div>
      )}

      {/* Categories */}
      <h2 className="text-xl font-bold mb-4">Categories</h2>
      {categoriesLoading && <p>Loading...</p>}
      {categoriesError && <p className="text-red-500">Error: {categoriesError}</p>}
      <ul>
        {categories.map((category) => (
          <li key={category.id} className="mb-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.name)}
                onChange={(e) => handleCheckboxChange(e, 'category', category.name)}
                className="mr-2"
              />
              {category.name}
            </label>
          </li>
        ))}
      </ul>

      {/* Brands */}
      <h2 className="text-xl font-bold mb-4">Brands</h2>
      {brandsLoading && <p>Loading...</p>}
      {brandsError && <p className="text-red-500">Error: {brandsError}</p>}
      <ul>
        {brands.map((brand) => (
          <li key={brand.id} className="mb-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand.name)}
                onChange={(e) => handleCheckboxChange(e, 'brand', brand.name)}
                className="mr-2"
              />
              {brand.name}
            </label>
          </li>
        ))}
      </ul>

      {/* Price Range */}
      <div className="mt-4">
        <h2 className="font-bold mb-2">Price</h2>
        <Slider
          range
          min={0}
          max={1000}
          defaultValue={[priceRange.min, priceRange.max]}
          value={localPriceRange}
          onChange={handlePriceChange}
          onAfterChange={handlePriceAfterChange}
          trackStyle={[{ backgroundColor: 'black' }]}
          handleStyle={[{ borderColor: 'black' }, { borderColor: 'black' }]}
        />
        <div className="flex justify-between mt-2">
          <span>Min: {localPriceRange[0]} MAD</span>
          <span>Max: {localPriceRange[1]} MAD</span>
        </div>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  selectedCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedBrands: PropTypes.arrayOf(PropTypes.string).isRequired,
  priceRange: PropTypes.shape({
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
  }).isRequired,
};

export default Sidebar;
