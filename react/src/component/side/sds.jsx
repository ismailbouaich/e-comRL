import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProducts,
  searchProducts,
  setFavoriteProduct,
  setSelectedCategory,
} from '../redux/actions/productActions';
import {
  selectProducts,
  selectSearchResults,
  selectLoading,
  selectError,
  selectPagination,
  selectFavorites,
} from '../redux/selectors/productSelectors';
import Sidebar from './side/Side';
import NotFoundImage from '../assets/images/empty.png';
import { Button } from '../components/ui/button';
import { useDebounce } from './hooks/useDebounce';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaHeart, FaEye } from 'react-icons/fa';
import { BsCart } from 'react-icons/bs';
import { IoHeartDislike } from 'react-icons/io5';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '../components/ui/pagination';

const Store = () => {
  const [searchKey, setSearchKey] = useState('');
  const debouncedSearchKey = useDebounce(searchKey, 500); // Reduced debounce time
  const [filters, setFilters] = useState({
    selectedCategories: [],
    selectedBrands: [],
    priceRange: { min: 0, max: 1000 },
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState('all');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const rawProducts = useSelector(selectProducts);
  const searchResults = useSelector(selectSearchResults) || [];
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const pagination = useSelector(selectPagination);
  const user = useSelector((state) => state.user.user);
  const favorites = useSelector(selectFavorites);

  const products = useMemo(
    () => (debouncedSearchKey ? searchResults : rawProducts) || [],
    [debouncedSearchKey, searchResults, rawProducts]
  );

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (location.state && location.state.selectedCategory) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        selectedCategories: [location.state.selectedCategory.name],
      }));
    }
  }, [location.state]);

  useEffect(() => {
    if (!debouncedSearchKey) {
      dispatch(fetchProducts(currentPage, sortOption, filters.selectedCategories, filters.selectedBrands, filters.priceRange));
    }
  }, [dispatch, currentPage, debouncedSearchKey, sortOption, filters.selectedCategories, filters.selectedBrands, filters.priceRange]);

  
  useEffect(() => {
    if (filters.selectedCategories.length > 0 || filters.selectedBrands.length > 0) {
      dispatch(fetchProducts(1, sortOption, filters.selectedCategories, filters.selectedBrands, filters.priceRange));
      setCurrentPage(1); // Reset to first page
    }
  }, [dispatch, filters, sortOption]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchCategory =
        filters.selectedCategories.length === 0 ||
        (product.category && filters.selectedCategories.includes(product.category.name));
      const matchBrand =
        filters.selectedBrands.length === 0 ||
        (product.brand && filters.selectedBrands.includes(product.brand.name));
      const matchPrice =
        product.price >= filters.priceRange.min && product.price <= filters.priceRange.max;

      return matchCategory && matchBrand && matchPrice;
    });
  }, [products, filters]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page on filter change
    dispatch(setSelectedCategory(newFilters.selectedCategories, newFilters.selectedBrands));
  }, [dispatch]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    dispatch(fetchProducts(newPage, sortOption, filters.selectedCategories, filters.selectedBrands, filters.priceRange));
  };

  const addToCart = (id, quantity, productName, image, price) => {
    const userId = user.id;
    const key = `cart_${userId}`;
    const existingCartItems = JSON.parse(localStorage.getItem(key)) || [];
    const existingCartItem = existingCartItems.find((item) => item.id === id);

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
    } else {
      existingCartItems.push({ id, quantity, productName, image, price });
    }

    localStorage.setItem(key, JSON.stringify(existingCartItems));
    window.dispatchEvent(new CustomEvent('productAdded'));
    console.log('Product added to cart:', id);
  };

  const handleFavoriteToggle = (productId) => {
    console.log('Toggling favorite for product ID:', productId);
    dispatch(setFavoriteProduct(productId));
  };

  const handleSortChange = (sort) => {
    setSortOption(sort);
    setCurrentPage(1); // Reset to first page on sort change
  };

  return (
    <div className="flex">
      <Sidebar onFilterChange={handleFilterChange} />
      <div className="w-3/4 p-6 my-1">
        <div className="flex justify-between mb-4">
          <div className="search-bar flex items-center space-x-2">
            <input
              type="text"
              onChange={(e) => setSearchKey(e.target.value)}
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
              className={`p-2 rounded ${
                sortOption === 'price_asc' ? 'bg-black text-white' : 'border'
              }`}
              onClick={() => handleSortChange('price_asc')}
            >
              Price ascending
            </button>
            <button
              className={`p-2 rounded ${
                sortOption === 'price_desc' ? 'bg-black text-white' : 'border'
              }`}
              onClick={() => handleSortChange('price_desc')}
            >
              Price descending
            </button>
          </div>
        </div>
        {loading && <LoadingSpinner />}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center">
            <img src={NotFoundImage} alt="No products found" className="mx-auto mb-4" />
            <p>No products found.</p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loading &&
            filteredProducts.map((product) => (
              <div
                className="border p-4 rounded-lg relative group hover:shadow-lg transition-shadow duration-300"
                key={product.id}
              >
                <div className="mb-4">
                  <img
                    src={`http://127.0.0.1:8000/storage/${
                      product.images && product.images.length > 0 && product.images[0].file_path
                    }`}
                    alt={product.product_name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link
                    to={`/product/${product.id}`}
                    state={{ user }}
                    className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <FaEye className="text-gray-700" />
                  </Link>
                  <button
                    onClick={() => handleFavoriteToggle(product.id)}
                    className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    {favorites.includes(product.id) ? (
                      <IoHeartDislike className="text-red-500" />
                    ) : (
                      <FaHeart className="text-gray-700" />
                    )}
                  </button>
                </div>
                <h2 className="text-lg font-bold mb-2">{product.product_name}</h2>
                <p className="text-gray-700 mb-2">${product.price}</p>
                <p className="text-gray-500 mb-4">
                  {product.category && product.category.name}, {product.brand && product.brand.name}
                </p>
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    onClick={() =>
                      addToCart(
                        product.id,
                        1,
                        product.product_name,
                        product.images && product.images.length > 0 ? `http://127.0.0.1:8000/storage/${product.images[0].file_path}` : '',
                        product.price
                      )
                    }
                    className="hover:bg-gray-800 bg-black text-white font-bold py-2 px-4 rounded"
                  >
                    <BsCart className="inline-block mr-2" /> Add to Cart
                  </Button>
                </div>
              </div>
            ))}
        </div>
        {pagination && (
          <Pagination>
            <PaginationContent>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </PaginationPrevious>
              {[...Array(pagination.last_page)].map((_, index) => (
                <PaginationItem key={index} active={index + 1 === currentPage}>
                  <PaginationLink onClick={() => handlePageChange(index + 1)}>
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.last_page}
              >
                Next
              </PaginationNext>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
};

export default Store;
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { fetchCategories } from '../../redux/actions/categoryActions';
import { selectCategories } from '../../redux/selectors/categorySelectors';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const Swipe = () => {
  const categories = useSelector(selectCategories) || [];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryClick = (category) => {
    console.log('Navigating with category:', category); // Debug log
    navigate('/store', { state: { selectedCategory: category } });
  };

  return (
    <Swiper spaceBetween={10} slidesPerView={5} className="w-[100%]">
      {categories.map((item, index) => (
        <SwiperSlide key={index} className="h-[200px] flex items-center" onClick={() => handleCategoryClick(item)}>
          <div className="card p-4 rounded-lg shadow-lg text-center max-w-[200px] min-w-[200px] h-[90%] flex flex-col justify-center">
            <h3 className="text-sm font-bold">{item.name}</h3>
            <img src={`http://127.0.0.1:8000/storage/${item.icon}`} className="bg-cover" alt={item.name} />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Swipe;
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../redux/actions/categoryActions';
import { fetchBrands } from '../../redux/actions/brandActions';
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
    onFilterChange({ selectedCategories, selectedBrands, priceRange });
  }, [selectedCategories, selectedBrands, priceRange, onFilterChange]);

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
import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  SEARCH_PRODUCTS_REQUEST,
  SEARCH_PRODUCTS_SUCCESS,
  SEARCH_PRODUCTS_FAILURE,
  FETCH_PRODUCT_REQUEST,
  FETCH_PRODUCT_SUCCESS,
  FETCH_PRODUCT_FAILURE,
  SET_FAVORITE_PRODUCT_REQUEST,
  SET_FAVORITE_PRODUCT_SUCCESS,
  SET_FAVORITE_PRODUCT_FAILURE,
  FETCH_FAVORITE_PRODUCT_REQUEST,
  FETCH_FAVORITE_PRODUCT_SUCCESS,
  FETCH_FAVORITE_PRODUCT_FAILURE
} from '../constants/productConstants';

const initialState = {
  loading: false,
  products: [],
  searchResults: [],
  product:{},
  relatedByCategory: [],
  relatedByBrand: [],
  favorites: [],
  pagination: {},
  error: ''
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PRODUCTS_REQUEST:
    case FETCH_PRODUCT_REQUEST:
    case SEARCH_PRODUCTS_REQUEST:
    case SET_FAVORITE_PRODUCT_REQUEST:
    case FETCH_FAVORITE_PRODUCT_REQUEST:
      return {
        ...state,
        loading: true
      };
    case FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        products: action.payload.data,
        pagination: {
          current_page: action.payload.current_page,
          last_page: action.payload.last_page,
        },
      };
      case FETCH_PRODUCT_SUCCESS:
        return{
          ...state,
          loading:false,
          product:action.payload.product,
          relatedByCategory:action.payload.relatedByCategory,
          relatedByBrand:action.payload.relatedByBrand,
          error:'',

        };
    case SEARCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        searchResults: action.payload
      };
    case SET_FAVORITE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        favorites: state.favorites.includes(action.payload)
          ? state.favorites.filter((id) => id !== action.payload)
          : [...state.favorites, action.payload]
      };
    case FETCH_FAVORITE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        favorites: action.payload
      };
    case FETCH_PRODUCTS_FAILURE:
    case SEARCH_PRODUCTS_FAILURE:
    case SET_FAVORITE_PRODUCT_FAILURE:
    case FETCH_FAVORITE_PRODUCT_FAILURE:
    case FETCH_PRODUCT_FAILURE: 
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

export default productReducer;
import axios from 'axios';
import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  SEARCH_PRODUCTS_REQUEST,
  SEARCH_PRODUCTS_SUCCESS,
  SEARCH_PRODUCTS_FAILURE,
  SET_FAVORITE_PRODUCT_REQUEST,
  SET_FAVORITE_PRODUCT_SUCCESS,
  SET_FAVORITE_PRODUCT_FAILURE,
  FETCH_FAVORITE_PRODUCT_REQUEST,
  FETCH_FAVORITE_PRODUCT_SUCCESS,
  FETCH_FAVORITE_PRODUCT_FAILURE,
  SET_SELECTED_CATEGORY,
  FETCH_PRODUCT_FAILURE,
  FETCH_PRODUCT_SUCCESS,
  FETCH_PRODUCT_REQUEST
} from '../constants/productConstants';

export const fetchProducts = (page = 1, sort = 'all', selectedCategories = [], selectedBrands = [], priceRange = { min: 0, max: 1000 }) => async (dispatch) => {
  dispatch({ type: FETCH_PRODUCTS_REQUEST });
  try {
    const response = await axios.get(`/product/list`, {
      params: {
        page,
        sort,
        selectedCategories,
        selectedBrands,
        priceRange,
      },
    });
    dispatch({ type: FETCH_PRODUCTS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_PRODUCTS_FAILURE, payload: error.message });
  }
};


export const searchProducts = (searchKey) => async (dispatch) => {
  dispatch({ type: SEARCH_PRODUCTS_REQUEST });
  try {
    const response = await axios.get(`/search/${searchKey}`);
    dispatch({ type: SEARCH_PRODUCTS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: SEARCH_PRODUCTS_FAILURE, payload: error.message });
  }
};

export const setFavoriteProduct = (productId) => async (dispatch) => {
  dispatch({ type: SET_FAVORITE_PRODUCT_REQUEST });
  try {
    // Assuming you have an API endpoint for toggling favorites
    await axios.post(`/products/${productId}/favorite`);
    dispatch({ type: SET_FAVORITE_PRODUCT_SUCCESS, payload: productId });
  } catch (error) {
    dispatch({ type: SET_FAVORITE_PRODUCT_FAILURE, payload: error.message });
  }
};

export const fetchFavoriteProducts = () => async (dispatch) => {
  dispatch({ type: FETCH_FAVORITE_PRODUCT_REQUEST });
  try {
    const response = await axios.get('/products/favorites');
    dispatch({ type: FETCH_FAVORITE_PRODUCT_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_FAVORITE_PRODUCT_FAILURE, payload: error.message });
  }
};

export const fetchProduct = (id) => async (dispatch) => {
  dispatch({ type: FETCH_PRODUCT_REQUEST });

  try {
    const response = await axios.get(`/product/${id}`);
    const { product, relatedByCategory, relatedByBrand } = response.data;
    dispatch({ 
      type: FETCH_PRODUCT_SUCCESS, 
      payload: { product, relatedByCategory, relatedByBrand } 
  });
  } catch (error) {
    dispatch({ type: FETCH_PRODUCT_FAILURE, error });
  }
};


export const setSelectedCategory = (category) => ({
  type: SET_SELECTED_CATEGORY,
  payload: category,
});

