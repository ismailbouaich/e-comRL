import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import BingMap from './BingMap';
import Button from 'react-bootstrap/Button';
import CommentForm from './CommentForm';
import CommentList from './CommentList ';
import Model from '../common/Model';
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
  const [loadKey, setLoadKey] = useState(Date.now());
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const product = useSelector((state) => state.product.product);
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
    setLoadKey(Date.now());
  }, []);

  useEffect(() => {
    if (stripe_url) {
      window.location.href = stripe_url;
    }
  }, [stripe_url]);

  const handleOpenModel = () => {
    setIsOpen(true);
  };

  const handleCloseModel = () => {
    setIsOpen(false);
  };

  const handleLocationSelect = (address, zip_code, city) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      address,
      zip_code,
      city,
    }));
  };

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
            <p className="mb-2">{product.discounted_price}</p>
            <p className="mb-2"><strong>Stock Quantity:</strong> {product.stock_quantity}</p>
            {product.category && <p className="mb-2"><strong>Category:</strong> {product.category.name}</p>}
            {user && <span className="mb-4 block">{user.name}</span>}
            <div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-center">
                  <button
                    type="button"
                    className="flex justify-center items-center w-10 h-10 rounded-full text-white focus:outline-none bg-gray-400 hover:bg-gray-500"
                    onClick={handleDecrement}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                    </svg>
                  </button>
                  <span id="counter" className="text-4xl font-bold mx-4">{quantity}</span>
                  <button
                    type="button"
                    className="flex justify-center items-center w-10 h-10 rounded-full text-white focus:outline-none bg-indigo-500 hover:bg-indigo-600"
                    onClick={handleIncrement}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v12M6 12h12"></path>
                    </svg>
                  </button>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-500 text-white rounded shadow"
                  onClick={handleOpenModel}
                >
                  Buy
                </button>
                {isOpen && (
                  <Model title="Map Model" onClose={handleCloseModel}>
                    <BingMap key={loadKey} onLocationSelect={handleLocationSelect} />
                    <button
                      type="submit"
                      className="mt-4 px-4 py-2 bg-green-500 text-white rounded shadow"
                      disabled={orderLoading}
                    >
                      {orderLoading ? 'Processing...' : 'Order'}
                    </button>
                  </Model>
                )}
              </form>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {product.images && product.images.length > 0 && product.images.map((image) => (
              <img
                key={image.id}
                src={`http://127.0.0.1:8000/storage/${image.file_path}`}
                alt=""
                className="cursor-pointer rounded shadow"
                onClick={() => handleImageClick(image.file_path)}
              />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center">No product found.</p>
      )}
      <div className="mt-6">
        <Rating productId={id}/>
        <CommentForm productId={id} />
        <CommentList productId={id} />
      </div>
    </div>
  );
};

export default Product;
