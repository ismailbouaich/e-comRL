import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../side/Side';
import Header from './Header';
import Products from './Products';
import Pagination from './Pagination';
import { fetchProducts, setFavoriteProduct } from '../../redux/actions/productActions';
import { useDebounce } from '../hooks/useDebounce';

const Store = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const [searchKey, setSearchKey] = useState('');
  const [filters, setFilters] = useState(() => {
    let initialFilters = {
      selectedCategories: [],
      selectedBrands: [],
      priceRange: { min: 0, max: 1000 },
    };

    if (location.state) {
      if (location.state.selectedCategory) {
        initialFilters.selectedCategories = [location.state.selectedCategory];
      }
      if (location.state.selectedBrand) {
        initialFilters.selectedBrands = [location.state.selectedBrand];
      }
    }

    return initialFilters;
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState('all');

  const { products, loading, error, pagination, favorites } = useSelector((state) => state.product);
  const user = useSelector((state) => state.user.user);

  const debouncedSearchKey = useDebounce(searchKey, 500);

  const [isFetching, setIsFetching] = useState(false);

  // Fetch products whenever dependencies change
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setIsFetching(true);
      await dispatch(
        fetchProducts(
          currentPage,
          sortOption,
          filters.selectedCategories,
          filters.selectedBrands,
          filters.priceRange,
          debouncedSearchKey
        )
      );
      setIsFetching(false);
    };

    fetchFilteredProducts();
  }, [dispatch, currentPage, sortOption, filters, debouncedSearchKey]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const handlePageChange = (newPage) => {
    if (isFetching || newPage === currentPage) return;
    if (newPage < 1 || (pagination && newPage > pagination.totalPages)) return;
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

  const handleInputChange = (e) => {
    setSearchKey(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="flex">
      <Sidebar
        onFilterChange={handleFilterChange}
        selectedCategories={filters.selectedCategories}
        selectedBrands={filters.selectedBrands}
        priceRange={filters.priceRange}
      />
      <div className="w-3/4 p-6 my-1 grid grid-rows-[auto_1fr_auto] min-h-screen">
        <Header
          searchKey={searchKey}
          handleInputChange={handleInputChange}
          sortOption={sortOption}
          handleSortChange={handleSortChange}
        />
        <Products
          products={products}
          loading={loading}
          error={error}
          favorites={favorites}
          handleFavoriteToggle={handleFavoriteToggle}
          addToCart={addToCart}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={pagination ? pagination.totalPages : 1}
          handlePageChange={handlePageChange}
          isFetching={isFetching}
        />
      </div>
    </div>
  );
};

export default Store;
