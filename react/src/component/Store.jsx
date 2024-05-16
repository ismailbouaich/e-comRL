import { useState, useEffect } from 'react';
import axios from 'axios';
import Category from './Category';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import "./store.scss"


const Store = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchKey, setSearchKey] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  useEffect(() => {
    axios.get(`/product/list`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []); // Empty dependency array to fetch products only once on component mount

 
  const handleSearch = () => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    setSearchError(false); // Reset search error

    // Set a new timeout to perform search after a delay
    const timeout = setTimeout(() => {
      axios.get(`/search/${searchKey}`)
        .then((response) => {
          setSearchResults(response.data);
        })
        .catch((error) => {
          console.error(error);
          setSearchError(true); // Set search error if request fails
          setSearchResults([]); // Clear search results
        });
    }, 500); // Adjust delay as needed

    setTypingTimeout(timeout);
  };

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category.id === selectedCategory)
    : products;

   
    const addToCart1 = (productId, quantity,product_name,images,price) => {
      // Get the existing cart items from local storage
      const existingCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
      // Check if the product is already in the cart
      const existingCartItem = existingCartItems.find(item => item.productId === productId);
    
      // If the product is already in the cart, update its quantity
      if (existingCartItem) {
        existingCartItem.quantity += quantity;
      } else {
        // If the product is not in the cart, add it to the cart items
        existingCartItems.push({ productId, quantity,product_name,images,price});
      }
    
      // Save the updated cart items back to local storage
      localStorage.setItem('storedProducts', JSON.stringify(existingCartItems));
    
      console.log('Product added to cart:', productId);
    };
    


    return (
      <div className="store-container">
         <div className="category-row">
      <Category onSelectCategory={setSelectedCategory} />
    </div>
    <div className="content-section">
        <div className="search-bar">
          <input 
            type="text" 
            onChange={(e) => setSearchKey(e.target.value)}
            placeholder="Search products..." 
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        {searchError && <p className="error-message">Not Found!</p>}
        <div className="product-grid">
          {(searchResults.length > 0 ? searchResults : filteredProducts).map((product) => (
            <div className='product-card' key={product.id}>
              <div className='product-image'>
                <img
                  src={`http://127.0.0.1:8000/storage/${(product.images && product.images.length > 0 && product.images[0].file_path)}`}
                  alt={product.product_name}
                />
              </div>
              <div className='product-info'>
                <h5 className='product-title'>{product.product_name}</h5>
                <p className='product-category'>{product.category && product.category.name}</p>
                <Link to={`/product/${product.id}`} state={{ user }} className='btn-more'>Show More</Link>
                <button type="button" onClick={() => addToCart1(product.id, 1,product.product_name,product.images,product.price)} className="btn-add-to-cart">Add to cart2</button>
              </div>
            </div>
          ))}
           </div>
        </div>
      </div>
    );
};

export default Store;

Store.propTypes={
  user:PropTypes.object
}
