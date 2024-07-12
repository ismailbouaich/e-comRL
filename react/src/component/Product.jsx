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

const Product = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const [order, setOrder] = useState({
    quantity: '',
    products: [],
  });
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrder((prevOrder) => ({
      ...prevOrder,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const orderData = {
      ...order,
      products: [{ product_id: product.id, quantity: order.quantity }],
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
                <div>
                  <label htmlFor="quantity" className="block mb-2 font-semibold">Quantity</label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded"
                    id="quantity"
                    name="quantity"
                    onChange={handleInputChange}
                  />
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
        <CommentForm productId={id} />
        <CommentList productId={id} />
      </div>
    </div>
  );

};

export default Product;
