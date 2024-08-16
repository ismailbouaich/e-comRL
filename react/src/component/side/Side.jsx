import React, { useEffect, useState } from 'react';
import {  useSelector } from 'react-redux';
import { fetchCategories,  } from '../../redux/actions/categoryActions';
import { fetchBrands } from '../../redux/actions/brandActions';
import { selectCategories, selectLoading as selectCategoriesLoading, selectError as selectCategoriesError } from '../../redux/selectors/categorySelectors';
import { selectBrands, selectLoading as selectBrandsLoading, selectError as selectBrandsError } from '../../redux/selectors/brandSelectors';
const Sidebar = ({ onFilterChange, selectedCategories,selectedBrands}) => {

  
  const categories = useSelector(selectCategories) || [];
  const categoriesLoading = useSelector(selectCategoriesLoading);
  const categoriesError = useSelector(selectCategoriesError);

  const brands = useSelector(selectBrands) || [];
  const brandsLoading = useSelector(selectBrandsLoading);
  const brandsError = useSelector(selectBrandsError);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });


 



  const handlePriceChange = (event) => {
    const { name, value } = event.target;
    const newPriceRange = { ...priceRange, [name]: Number(value) };
    setPriceRange(newPriceRange);
    onFilterChange({ selectedCategories, selectedBrands, priceRange: newPriceRange });
  };


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
      onFilterChange({ selectedCategories: newSelectedCategories, selectedBrands });
    } else if (type === 'brand') {
      const newSelectedBrands = updateState(selectedBrands);
      onFilterChange({ selectedCategories, selectedBrands: newSelectedBrands });
    }
  };

  const renderKeywords = () => {
    const allKeywords = [...selectedCategories,];
    return allKeywords.map((keyword, index) => (
      <span key={index} className="bg-gray-200 px-2 py-1 rounded-full mr-2">{keyword}</span>
    ));
  };

  return (
    <div className="w-1/4 p-4">
      <h2 className="text-xl font-bold mb-4">Categories</h2>
      {categoriesLoading && <p>Loading...</p>}
      {categoriesError && <p className="text-red-500">Error: {categoriesError}</p>}
      <ul>
        {categories.map((category) => (
          <li key={category.id} className="mb-2">
            <label>
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

      <h2 className="text-xl font-bold mb-4">Brands</h2>
      {brandsLoading && <p>Loading...</p>}
      {brandsError && <p className="text-red-500">Error: {brandsError}</p>}
      <ul>
        {brands.map((brand) => (
          <li key={brand.id} className="mb-2">
            <label>
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
      <div>
        <h2 className="font-bold mb-2">Price</h2>
        <input
          type="range"
          name="min"
          value={priceRange.min}
          min="0"
          max="1000"
          onChange={handlePriceChange}
          className="w-full accent-black"
        />
        <input
          type="range"
          name="max"
          value={priceRange.max}
          min="0"
          max="1000"
          onChange={handlePriceChange}
          className="w-full accent-black"
        />
        <div>
          <span>Min: ${priceRange.min}</span>
          <span>Max: ${priceRange.max}</span>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Selected Filters</h3>
        <div className="flex flex-wrap">
          {renderKeywords()}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
