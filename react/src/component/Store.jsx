import { useState, useEffect } from 'react';
import axios from 'axios';
import Category from './Category';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import "./store.scss"


const Store = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchKey, setSearchKey] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  const navigate = useNavigate();
   
    
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      return navigate('/login')
    }
  });

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
    setSearchError(false); 
    const timeout = setTimeout(() => {
      axios.get(`/search/${searchKey}`)
        .then((response) => {
          setSearchResults(response.data);
        })
        .catch((error) => {
          console.error(error);
          setSearchError(true); 
          setSearchResults([]); 
        });
    }, 500); 

    setTypingTimeout(timeout);
  };

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category.id === selectedCategory)
    : products;

   
    const addToCart1 = (productId, quantity,product_name,images,price) => {
      const existingCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
      const existingCartItem = existingCartItems.find(item => item.productId === productId);
    
      if (existingCartItem) {
        existingCartItem.quantity += quantity;
      } else {
        existingCartItems.push({ productId, quantity,product_name,images,price});
      }
    
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
                <p>{product.price}</p>
                <p>{product.discounted_price}</p>
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
