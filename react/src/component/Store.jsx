import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProducts,
  searchProducts,
} from '../redux/actions/productActions';
import {
  selectProducts,
  selectSearchResults,
  selectLoading,
  selectError,
} from '../redux/selectors/productSelectors';
import Sidebar from './side/Side';

const Store = () => {
  const [searchKey, setSearchKey] = useState('');
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [filters, setFilters] = useState({
    selectedCategories: [],
    selectedBrands: [],
    selectedColors: [],
    priceRange: { min: 0, max: 1000 },
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const products = useSelector(selectProducts) || [];
  const searchResults = useSelector(selectSearchResults) || [];
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleSearch = useCallback(() => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    const timeout = setTimeout(() => {
      dispatch(searchProducts(searchKey));
    }, 500);
    setTypingTimeout(timeout);
  }, [dispatch, searchKey, typingTimeout]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

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
    console.log('Product added to cart:', id);
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
            <button onClick={handleSearch} className="p-2 bg-blue-500 text-white rounded-lg">
              Search
            </button>
          </div>
          <div className="flex gap-2">
            <button className="bg-black text-white p-2 rounded">New</button>
            <button className="border p-2 rounded">Price ascending</button>
            <button className="border p-2 rounded">Price descending</button>
            <button className="border p-2 rounded">Rating</button>
          </div>
        </div>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">Not Found!</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(searchResults.length > 0 ? searchResults : filteredProducts).map((product) => (
            <div className="border p-4 rounded-lg shadow-md" key={product.id}>
              <div className="mb-4">
                <img
                  src={`http://127.0.0.1:8000/storage/${
                    product.images && product.images.length > 0 && product.images[0].file_path
                  }`}
                  alt={product.product_name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-semibold">{product.product_name}</h3>
                <p className="text-gray-500">${product.price}</p>
              </div>
              <div className="flex justify-between items-center">
                <Link
                  to={`/product/${product.id}`}
                  state={{ user }}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                >
                  Details
                </Link>
                <button
                  onClick={() =>
                    addToCart(
                      product.id,
                      1,
                      product.product_name,
                      product.images && product.images.length > 0 ? `http://127.0.0.1:8000/storage/${product.images[0].file_path}` : '',
                      product.price
                    )
                  }
                  className="bg-green-500 text-white py-2 px-4 rounded-lg"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Store;
