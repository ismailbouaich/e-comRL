import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import BingMap from './BingMap'; // Assuming BingMap component is imported
import { useNavigate } from 'react-router';


const Cart = ({ user }) => {
  const [checkAll, setCheckAll] = useState(false);
  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([]); // Array to hold selected items for order
  const [order, setOrder] = useState({
    quantity: '', // Adjust as needed
    address: '',
    zip_code: '',
    city: '',
  });
  

  const [loading, setLoading] = useState(false);
  const [loadKey, setLoadKey] = useState(Date.now()); // For potential BingMap re-rendering
  const [show, setShow] = useState(false);
  const [stripeSessionId, setStripeSessionId] = useState();
  const [stripe_url, setStripe_url] = useState();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLocationSelect = (address, zip_code, city) => {
    setOrder(prevOrder => ({
      ...prevOrder,
      address,
      zip_code,
      city,
    }));
  };
useEffect(() => {
    setLoadKey(Date.now()); // Update BingMap key for potential re-rendering
  }, []);


const navigate = useNavigate();
   
    
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      return navigate('/login')
    }
  });

  useEffect(() => {
    if (stripe_url) {
      window.location.href = stripe_url; // Redirect to Stripe checkout
    }
  }, [stripe_url, stripeSessionId]);
   // Trigger redirect only on url/session changes
  


  useEffect(() => {
    // Retrieve cart items from local storage
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    setProducts(storedProducts);
  }, []);

  const removeFromCart = (id) => {
  };

  const handleCheckAllChange = (e) => {
    const checked = e.target.checked;
    setCheckAll(checked); // Update "Check All" state
    setOrderItems(prevOrderItems =>
      checked
        ? products.map(item => ({ ...item, quantity: 1, totalPrice: item.price })) // Add all with quantity 1
        : [] // Clear orderItems if unchecked
    );
  };

   const handleCheckboxChange = (e, item) => {
    const checked = e.target.checked;
    setOrderItems(prevOrderItems => {
      if (checked) {
        const existingItem = prevOrderItems.find(orderItem => orderItem.id === item.id);
        if (!existingItem) {
          return [...prevOrderItems, { ...item, quantity: 1, totalPrice: item.price }];
        }
      } else {
        return prevOrderItems.filter(orderItem => orderItem.id !== item.id);
      }
      return prevOrderItems;
    });
  };

  const handleQuantityChange = (e, itemId) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (isNaN(newQuantity) || newQuantity < 1) {
      console.error('Invalid quantity:', newQuantity);
      return;
    }

    setOrderItems(prevOrderItems =>
      prevOrderItems.map(item => {
        if (item.id === itemId) {
          const totalPrice = newQuantity * item.price;
          return { ...item, quantity: newQuantity, totalPrice: totalPrice };
        }
        return item;
      })
    );
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        ...order,
        // Send all selected items
        customer_id: user.id,
        customer_name: user.name,
        cart_items: products.map(item => ({
          product_id: item.productId,
          quantity:item.quantity,
          price:item.price
          // Include other item properties as needed
        })),
      };

      const response = await axios.post(`/cart/buy`, orderData);

      // Handle Stripe response
      setStripe_url(response.data.stripe_url);
      setStripeSessionId(response.data.session_id);
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('An error occurred while submitting the order. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart">
    <h2>Your Shopping Cart</h2>
    <table className="cart-items table table-bordered table-hover">
      <thead>
        <tr>
          <th>
            <input
              type="checkbox"
              id="check-all"
              onChange={handleCheckAllChange}
              checked={checkAll}
            />
            <label htmlFor="check-all">Check All</label>
          </th>
          <th className="text-center">Item</th>
          <th className="text-center">Price</th>
          <th className="text-center">Qty (Cart)</th>
          <th className="text-center">Qty (Order)</th>
          <th className="text-center">Total</th>
          <th className="text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        {products.map((item, index) => (
          <tr className="cart-item" key={index}>
            <td>
              <input
                type="checkbox"
                id={`order-checkbox-${item.id}`}
                checked={checkAll || orderItems.some(orderItem => orderItem.id === item.id)}
                onChange={(e) => handleCheckboxChange(e, item)}
              />
              <label htmlFor={`order-checkbox-${item.id}`} className="ms-2">
                Add to Order
              </label>
            </td>
            <td className="text-center">{item.product_name}</td>
            <td className="text-center">${(item.quantity * item.price).toFixed(2)}</td>
            <td className="text-center">
              <input
                type="number"
                min="1"
                className="form-control form-control-sm"
                value={orderItems.find(orderItem => orderItem.id === item.id)?.quantity || 0}
                onChange={(e) => handleQuantityChange(e, item.id)}
              />
            </td>
            <td className="text-center">
              {orderItems.some(orderItem => orderItem.id === item.id)
                ? orderItems.find(orderItem => orderItem.id === item.id).quantity
                : '-'}
            </td>
            <td className="text-center">
              ${(item.quantity * item.price).toFixed(2)}
            </td>
            <td className="text-center">
              <Button size="sm" variant="danger" onClick={() => removeFromCart(item.id)}>
                Remove
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={4}>
            <p>
              {/* Order Subtotal: $
              {orderItems.length > 0
                ? orderItems.reduce((total, item) => => {
        const totalPrice = parseFloat(item.totalPrice);
        return isNaN(totalPrice) ? total : total + totalPrice;
      }, 0).toFixed(2)
                : 'No items selected'} */}
                Order Subtotal: $
  {orderItems.length > 0
    ? orderItems.reduce((total, item) => {
        const totalPrice = parseFloat(item.totalPrice);
        return isNaN(totalPrice) ? total : total + totalPrice;
      }, 0).toFixed(2)
    : 'No items selected'}
            </p>
          </td>
          <td colSpan={2}>
            <Button variant="primary" onClick={handleShow} disabled={orderItems.length === 0}>
              Select Location & Checkout
            </Button>
          </td>
        </tr>
      </tfoot>
    </table>

    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Select a Location and Payment Method</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <BingMap key={loadKey} onLocationSelect={handleLocationSelect} />
        <hr />
        <p>Delivery Address:</p>
        <ul>
          <li>{order.address}</li>
          <li>{order.zip_code}</li>
          <li>{order.city}</li>
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading || !order.address}>
          {loading ? 'Processing...' : 'Checkout'}
        </Button>
      </Modal.Footer>
    </Modal>
  </div>
  
);
};

export default Cart;