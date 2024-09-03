import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectProducts,
  selectSearchResults,
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
  PaginationPrevious,
} from '../components/ui/pagination';
import {
  fetchProducts,
  searchProducts,
  setFavoriteProduct,
  
} from '../redux/actions/productActions';

import { useRef } from 'react';


const Store = () => {


  const [searchKey, setSearchKey] = useState('');
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
  
  const pagination = useSelector(selectPagination);
  const user = useSelector((state) => state.user.user);
  const favorites = useSelector(selectFavorites);
  const prevFilters = useRef(filters);
  const prevSortOption = useRef(sortOption);


  const debouncedSearchKey = useDebounce(searchKey, 500);
  const debouncedFilters = useDebounce(filters, 300);

  const { products, loading, error } = useSelector(state => state.product);

  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    const handleInitialLoad = async () => {
      let newFilters = { ...filters };
      if (location.state && (location.state.selectedCategory || location.state.selectedBrand)) {
        if (location.state.selectedCategory) {
          newFilters.selectedCategories = [location.state.selectedCategory];
        } else if (location.state.selectedBrand) {
          newFilters.selectedBrands = [location.state.selectedBrand];
        }
        setFilters(newFilters);
      }
     
      try {
       dispatch(fetchProducts(1, sortOption, newFilters.selectedCategories, newFilters.selectedBrands, newFilters.priceRange));
      } finally {
       
        setInitialLoadComplete(true);
      }
    };
  
    if (!initialLoadComplete) {
      handleInitialLoad();
    }
  }, [location.state, dispatch, sortOption, initialLoadComplete]);
  
  // Effect for handling filter changes after initial load
  useEffect(() => {
    const handleFilterChange = async () => {
      if (initialLoadComplete) {
       
          await dispatch(fetchProducts(currentPage, sortOption, filters.selectedCategories, filters.selectedBrands, filters.priceRange));
        
      }
    };
    

    handleFilterChange();
  }, [filters, sortOption, dispatch, initialLoadComplete,currentPage]);
  

  const filteredProducts = useMemo(() => {
    const productsToFilter = debouncedSearchKey ? searchResults : products;
    const { selectedCategories = [], selectedBrands = [], priceRange = { min: 0, max: 1000 } } = filters;
    return productsToFilter.filter((product) => {
      const matchCategory = selectedCategories.length === 0 || (product.category && selectedCategories.includes(product.category.name));
      const matchBrand = selectedBrands.length === 0 || (product.brand && selectedBrands.includes(product.brand.name));
      const matchPrice = product.price >= priceRange.min && product.price <= priceRange.max;
      return matchCategory && matchBrand && matchPrice;
    });
  }, [products, searchResults, debouncedSearchKey, filters]);




  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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
  };

  const handleFavoriteToggle = (productId) => {
    dispatch(setFavoriteProduct(productId));
  };

  const handleSortChange = (sort) => {
    setSortOption(sort);
    setCurrentPage(1);
  };
  const [typingTimeout, setTypingTimeout] = useState(null);

  const handleSearch = useCallback(() => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    const timeout = setTimeout(() => {
      dispatch(searchProducts(searchKey));
    }, 500);
    setTypingTimeout(timeout);
  }, [dispatch, searchKey, typingTimeout]);


  const handleInputChange = (e) => {
    setSearchKey(e.target.value);
    handleSearch(); // Trigger the search with debounce
  };

  return (
    <div className="flex">
    <Sidebar
  onFilterChange={handleFilterChange}
  selectedCategories={filters.selectedCategories}
  selectedBrands={filters.selectedBrands}
  priceRange={filters.priceRange}
/>
      <div className="w-3/4 p-6 my-1">
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
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center">
            <img src={NotFoundImage} alt="No products found" className="mx-auto mb-4" />
            <p>No products found.</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                <img  src={`http://127.0.0.1:8000/storage/${
                    product.images && product.images.length > 0 && product.images[0].file_path
                  }`} alt={product.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleFavoriteToggle(product.id)}
                      className="text-white p-2 rounded-full hover:bg-white hover:text-black transition-colors duration-300"
                    >
                      {favorites.includes(product.id) ? <IoHeartDislike size={20} /> : <FaHeart size={20} />}
                    </button>
                    <Link to={`/product/${product.id}`} className="text-white p-2 rounded-full hover:bg-white hover:text-black transition-colors duration-300">
                      <FaEye size={20} />
                    </Link>
                    <button
                   onClick={() => addToCart(
                    product.id, 
                    1, 
                    product.name, 
                    product.images && product.images.length > 0 ? `http://127.0.0.1:8000/storage/${product.images[0].file_path}` : '',
                    product.price
                  )}
                      className="text-white p-2 rounded-full hover:bg-white hover:text-black transition-colors duration-300"
                    >
                      <BsCart size={20} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold">{product.name}</h3>
                <p className="text-gray-600">{product.price} MAD</p>
              </div>
            </div>
          ))}
        </div>
         )}
      {filteredProducts.length > 0 && pagination && (

        <div className="mt-4">
            <Pagination>
    <PaginationPrevious 
      onClick={() => handlePageChange(currentPage - 1)} 
      disabled={currentPage === 1} 
    />
    <PaginationContent>
      {Array.from({ length: pagination.totalPages }, (_, i) => (
        <PaginationItem key={i}>
          <PaginationLink 
            onClick={() => handlePageChange(i + 1)} 
            active={i + 1 === currentPage}
          >
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      ))}
    </PaginationContent>
    <PaginationNext 
      onClick={() => handlePageChange(currentPage + 1)} 
      disabled={currentPage === pagination.totalPages || filteredProducts.length === 0} 
    />
  </Pagination>
        </div>
)}

      </div>
    </div>
  );
};

export default Store;