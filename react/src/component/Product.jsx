import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Button from 'react-bootstrap/Button';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

import { fetchProduct } from '../redux/actions/productActions';
import { createOrder } from '../redux/actions/orderActions';
import Rating from './Rating';

const Product = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const [order, setOrder] = useState({
    products: [],
  });
  const [quantity, setQuantity] = useState(1); // State for the counter
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const product = useSelector((state) => state.product.product);
  const relatedByCategory = useSelector((state) => state.product.relatedByCategory);
  const relatedByBrand = useSelector((state) => state.product.relatedByBrand);
  const loading = useSelector((state) => state.product.loading);
  const productError = useSelector((state) => state.product.error);
  const orderLoading = useSelector((state) => state.order.loading);
  const orderError = useSelector((state) => state.order.error);
  const stripe_url = useSelector((state) => state.order.order?.stripe_url);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    dispatch(fetchProduct(id));
  }, [dispatch, id]);

 

  useEffect(() => {
    if (stripe_url) {
      window.location.href = stripe_url;
    }
  }, [stripe_url]);

 

  

  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrement = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const orderData = {
      ...order,
      products: [{ product_id: product.id, quantity }],
      customer_id: user?.id,
      customer_name: user?.name,
    };
    dispatch(createOrder(orderData));
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


  const handleImageClick = (imagePath) => {
    setSelectedImage(imagePath);
  };

  return (
    <div className="container mx-auto mt-5">
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : product ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <br />
            {product.images && product.images.length > 0 && (
              <img
                src={`http://127.0.0.1:8000/storage/${selectedImage || product.images[0].file_path}`}
                alt={product.product_name}
                className="w-full h-auto rounded shadow-lg"
              />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.product_name}</h1>
            <p className="mb-4">{product.description}</p>
            <p className="mb-2"><strong>Price:</strong> ${product.price}</p>
            <p className="mb-2">{product.discounted_price ? <><strong>Discounted Price:</strong> ${product.discounted_price}</> : null}</p>
            <p className="mb-2"><strong>Stock Quantity:</strong> {product.stock_quantity}</p>
            {product.category && <p className="mb-2"><strong>Category:</strong> {product.category.name}</p>}
            {user && <span className="mb-4 block">{user.name}</span>}
            <div>
              <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative flex items-center max-w-[8rem]" onClick={handleIncrement}>
        <button type="button" id="decrement-button" data-input-counter-decrement="quantity-input" className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
            <svg className="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16"/>
            </svg>
        </button>
        <input type="text" id="quantity-input" data-input-counter aria-describedby="helper-text-explanation" onClick={handleDecrement} className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="999" required />
        <button type="button" id="increment-button" data-input-counter-increment="quantity-input" className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
            <svg className="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
            </svg>
        </button>
    </div>
              
              

                <div className="mt-8">
            <Link
             onClick={() =>
              addToCart(
                product.id,
                1,
                product.product_name,
                product.images && product.images.length > 0 ? `http://127.0.0.1:8000/storage/${product.images[0].file_path}` : '',
                product.price,
                product.quantity
              )
            }
              to={{
                pathname: "/checkout",
                state: { product}
              }} 
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Proceed To Checkout
            </Link>
          
          </div>

              </form>
              
              
                <button
                  onClick={() =>
                    addToCart(
                      product.id,
                      1,
                      product.product_name,
                      product.images && product.images.length > 0 ? `http://127.0.0.1:8000/storage/${product.images[0].file_path}` : '',
                      product.price,
                      product.quantity
                    )
                  }
                  className="bg-green-500 text-white py-2 px-4 rounded-lg"
                >
                  Add to Cart
                </button>
              {orderError && <p className="text-red-500 mt-2">{orderError}</p>}
             
            </div>
            <br />
            {product.images && product.images.length > 1 && (
              <div className="flex overflow-x-auto space-x-4">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={`http://127.0.0.1:8000/storage/${image.file_path}`}
                    alt={`${product.product_name} ${index}`}
                    className="w-24 h-24 object-cover rounded cursor-pointer"
                    onClick={() => handleImageClick(image.file_path)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center">No product found.</p>
      )}
      <div className="mt-6">
        <Rating productId={id} />
        <CommentForm productId={id} />
        <CommentList productId={id} />
      </div>
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Related Products by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {relatedByCategory.length > 0 ? (
            relatedByCategory.map((item) => (
              <div key={item.id} className="border p-4 rounded shadow">
                <img
                  src={`http://127.0.0.1:8000/storage/${item.images[0]?.file_path}`}
                  alt={item.product_name}
                  className="w-full h-auto rounded mb-2"
                />
                <h3 className="text-xl font-semibold">{item.product_name}</h3>
                <p className="text-gray-600">${item.price}</p>
              </div>
            ))
          ) : (
            <p>No related products found.</p>
          )}
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Related Products by Brand</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {relatedByBrand.length > 0 ? (
            relatedByBrand.map((item) => (
              <div key={item.id} className="border p-4 rounded shadow">
                <img
                  src={`http://127.0.0.1:8000/storage/${item.images[0]?.file_path}`}
                  alt={item.product_name}
                  className="w-full h-auto rounded mb-2"
                />
                <h3 className="text-xl font-semibold">{item.product_name}</h3>
                <p className="text-gray-600">${item.price}</p>
              </div>
            ))
          ) : (
            <p>No related products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
