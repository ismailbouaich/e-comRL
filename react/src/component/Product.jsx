import  { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BingMap from './BingMap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import CommentForm from './CommentForm';
import CommentList from './CommentList ';

const Product = ({ user }) => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [order, setOrder] = useState({
    amount: '',
    products: [],
  });
  const [loading, setLoading] = useState(false);
  const [loadKey, setLoadKey] = useState(Date.now());
  const [show, setShow] = useState(false);
  const [stripeSessionId, setStripeSessionId] = useState();
  const [stripe_url,setStripe_url]=useState();
  
   // State to store the Stripe session ID

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    setLoadKey(Date.now());
  }, []);


  useEffect(() => {
    axios.get(`/product/${id}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.error('Error fetching product data:', error);
      })
      .finally(() => {
        setLoading(false); 
      });
  }, [id]);

  const handleLocationSelect = (address, zip_code, city) => {
    setOrder(prevOrder => ({
      ...prevOrder,
      address,
      zip_code,
      city, 
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrder(prevOrder => ({
      ...prevOrder,
      [name]: value,
    }));
  };
  useEffect(() => {

    if (stripe_url) {alert("here"+stripe_url)
      window.location.href=stripe_url;  
    }
  
    
  }, [stripe_url,stripeSessionId]);



  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const orderData = { 
      ...order, 
      products: [{ product_id: product.id, quantity: order.amount }], 
      customer_id: user.id, 
      customer_name: user.name,
    };
    axios.post(`/order/create`, orderData)
      .then((response) => {
        setStripe_url(response.data.stripe_url);
        setStripeSessionId(response.data.session_id);
      })
      .catch((error) => {
        console.error('Error submitting order:', error);
        alert('An error occurred while submitting the order. Please try again later.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleImageClick = (imagePath) => {
    setSelectedImage(imagePath);
  };

  

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          
          <br />
          {product.images && product.images.length > 0 && (
            <img src={`http://127.0.0.1:8000/storage/${selectedImage || product.images[0].file_path}`} alt={product.product_name} className="img-fluid" />
          )}
        </div>
        <div className="col-md-6">
          <h1 className="mb-4">{product.product_name}</h1>
          <p>{product.description}</p>
          <p><strong>Price:</strong> ${product.price}</p>
          <p><strong>Stock Quantity:</strong> {product.stock_quantity}</p>
          {product.category &&  (
            <p><strong>Category:</strong> {product.category.name}</p>
          )}
          <span>{user.name}</span>
          <div className="col-md-6">
            <form onSubmit={handleSubmit} action='post'>
              <div className="mb-3">
                <label htmlFor="amount" className="form-label">Amount</label>
                <input type="number" className="form-control" id="amount" name="amount" onChange={handleInputChange} />
              </div>
              <Button variant="primary" onClick={handleShow}>Buy</Button>
              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Select a Location and Payment Method</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <BingMap key={loadKey} onLocationSelect={handleLocationSelect} />
                  <hr />
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                  <Button variant="primary" onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Processing...' : 'Order'}
                  </Button>
                 
                </Modal.Footer>
              </Modal>
            </form>
          </div>
        </div>
        <div className="row mt-3">
          {product.images && product.images.length > 0 && product.images.map((image) => (
            <div className="col-4 mb-2" key={image.id}>
              <img src={`http://127.0.0.1:8000/storage/${image.file_path}`} alt="" className="img-thumbnail" onClick={() => handleImageClick(image.file_path)} />
            </div>
          ))}
        </div>
      </div>
      <CommentForm productId={id}/>
      <CommentList productId={id}/>
    </div>
  );
};

export default Product;


