import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../redux/actions/categoryActions';
import { fetchBrands } from '../../redux/actions/brandActions';
import { selectCategories, selectLoading as selectCategoriesLoading, selectError as selectCategoriesError } from '../../redux/selectors/categorySelectors';
import { selectBrands, selectLoading as selectBrandsLoading, selectError as selectBrandsError } from '../../redux/selectors/brandSelectors';

const Sidebar = ({ onFilterChange }) => {
  const dispatch = useDispatch();

  const categories = useSelector(selectCategories) || [];
  const categoriesLoading = useSelector(selectCategoriesLoading);
  const categoriesError = useSelector(selectCategoriesError);

  const brands = useSelector(selectBrands) || [];
  const brandsLoading = useSelector(selectBrandsLoading);
  const brandsError = useSelector(selectBrandsError);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchBrands());
  }, [dispatch]);

  useEffect(() => {
    onFilterChange({ selectedCategories, selectedBrands,priceRange  });
  }, [selectedCategories, selectedBrands,priceRange , onFilterChange]);

  const handleCheckboxChange = (event, setSelectedState, keyword) => {
    const { checked } = event.target;
    setSelectedState((prevSelected) => {
      if (checked) {
        return [...prevSelected, keyword];
      } else {
        return prevSelected.filter((item) => item !== keyword);
      }
    });
  };

  const renderKeywords = () => {
    const allKeywords = [...selectedCategories, ...selectedBrands];
    return allKeywords.map((keyword, index) => (
      <span key={index} className="bg-gray-200 px-2 py-1 rounded-full">{keyword}</span>
    ));
  };

  const handlePriceChange = (event) => {
    const { name, value } = event.target;
    setPriceRange((prevRange) => ({
        ...prevRange,
        [name]: Number(value),
    }));
};

  return (
    <div className="w-1/5 ml-4 my-7 p-4 border border-gray-200 rounded-lg">
      <div className="mb-6">
        <h2 className="font-bold mb-2">Keywords</h2>
        <div className="flex flex-wrap gap-2">{renderKeywords()}</div>
      </div> 

      <div className="mb-6">
        <h2 className="font-bold mb-2">Categories</h2>
        <div className="space-y-2">
          {categoriesLoading && <p>Loading categories...</p>}
          {categoriesError && <p className="text-red-500">{categoriesError}</p>}
          {categories.map((category) => (
            <label key={category.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="form-checkbox"
                onChange={(e) => handleCheckboxChange(e, setSelectedCategories, category.name)}
              />
              <span>{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="font-bold mb-2">Brands</h2>
        <div className="space-y-2">
          {brandsLoading && <p>Loading Brands...</p>}
          {brandsError && <p className="text-red-500">{brandsError}</p>}
          {brands.map((brand) => (
            <label key={brand.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="form-checkbox"
                onChange={(e) => handleCheckboxChange(e, setSelectedBrands, brand.name)}
              />
              <span>{brand.name}</span>
            </label>
          ))}
        </div>
      </div>

      
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
    </div>
  );
};

export default Sidebar;
