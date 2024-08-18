import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProduct } from '../redux/actions/productActions';
import { createOrder } from '../redux/actions/orderActions';
import Rating from './Rating';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import { Button } from '../components/ui/button';
import StarRatingd from './AvgRating';

const Product = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const product = useSelector((state) => state.product.product);
  const relatedByCategory = useSelector((state) => state.product.relatedByCategory);
  const relatedByBrand = useSelector((state) => state.product.relatedByBrand);
  const loading = useSelector((state) => state.product.loading);
  const productError = useSelector((state) => state.product.error);
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

  const addToCart = () => {
    const userId = user.id;
    const key = `cart_${userId}`;
    const existingCartItems = JSON.parse(localStorage.getItem(key)) || [];
    const existingCartItem = existingCartItems.find((item) => item.id === product.id);

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
    } else {
      existingCartItems.push({
        id: product.id,
        quantity,
        productName: product.product_name,
        image: product.images && product.images.length > 0 ? `http://127.0.0.1:8000/storage/${product.images[0].file_path}` : '',
        price: product.price
      });
    }

    localStorage.setItem(key, JSON.stringify(existingCartItems));
    window.dispatchEvent(new CustomEvent('productAdded'));
    console.log('Product added to cart:', product.id);
  };

  const handleImageClick = (imagePath) => {
    setSelectedImage(imagePath);
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (!product) return <p className="text-center">No product found.</p>;


  return (
    <div className="container mx-auto mt-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          {product.images && product.images.length > 0 && (
            <img
              src={`http://127.0.0.1:8000/storage/${selectedImage || product.images[0].file_path}`}
              alt={product.product_name}
              className="w-full h-auto rounded shadow-lg"
            />
          )}
          {product.images && product.images.length > 1 && (
            <div className="flex overflow-x-auto space-x-4 mt-4">
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
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.product_name}</h1>
          <p className="mb-4">{product.description}</p>
          <p className="mb-2"><strong>Price:</strong> ${product.price}</p>
          {product.discounted_price && <p className="mb-2"><strong>Discounted Price:</strong> ${product.discounted_price}</p>}
          <p className="mb-2">
  <strong>Stock Quantity:</strong> 
  {product.stock_quantity > 0 ? product.stock_quantity : <span className="text-red-500">Not Available</span>}
</p>          {product.category && <p className="mb-2"><strong>Category:</strong> {product.category.name}</p>}
      
            <div className="flex items-center mb-2">
              <strong className="mr-2">Average Rating:</strong>
              {product.avg_rating !== undefined && product.avg_rating !== null ? (
                <>
                  <StarRatingd rating={Number(product.avg_rating)} />
                  <span className="ml-2">
                    ({typeof product.avg_rating === 'number' 
                      ? product.avg_rating.toFixed(1) 
                      : Number(product.avg_rating).toFixed(1)})
                  </span>
                </>
              ) : (
                <span>No ratings yet</span>
              )}
            </div>
            {product.stock_quantity > 0 ? (
  <div className="flex items-center space-x-3 mb-4">
    <span className="text-gray-700">Quantity:</span>
    <div className="flex items-center rounded-md">
      <Button
        type="button"
        onClick={handleDecrement}
        className="px-2.5 py-0.5 text-gray-600 rounded-full items-center justify-center bg-gray-100 focus:outline-none"
        disabled={quantity <= 1}
      >
        -
      </Button>
      <input
        id="myNumber"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Math.max(1, Math.min(parseInt(e.target.value) || 1, product.stock_quantity)))}
        className="w-11 text-center py-3 focus:outline-none"
        min="1"
        max={product.stock_quantity}
        disabled
      />
      <Button
        type="button"
        onClick={handleIncrement}
        className="px-2 py-0.5 text-gray-600 rounded-full items-center justify-center bg-gray-100 focus:outline-none"
        disabled={quantity >= product.stock_quantity}
      >
        +
      </Button>
    </div>
  </div>
) : null}

<div className="flex space-x-3">
  {product.stock_quantity > 0 ? (
    <>
      <button
        onClick={addToCart}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out"
      >
        Add to Cart
      </button>
      <Link
        to={{
          pathname: "/checkout",
          state: { product }
        }} 
        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out"
      >
        Buy Now
      </Link>
    </>
  ) : (
    <p className="text-red-500 font-bold">This product is currently out of stock</p>
  )}
</div>
          
          {orderError && <p className="text-red-500 mt-2">{orderError}</p>}
        </div>
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
      <div className="mt-6 w-[750px]">
        <Rating productId={id} />
        <CommentList productId={id} />
      </div>
    </div>
  );
};

export default Product;