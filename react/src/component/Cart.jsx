import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import BingMap from './BingMap';
import { useNavigate } from 'react-router';
import { addToCart, removeFromCart, updateQuantity, setCart, createCartItemsOrder } from '../redux/actions/cartActions';

const Cart = () => {
  const dispatch = useDispatch();
  const products = useSelector(state => state.cart.cart);
  const { loading, stripeUrl } = useSelector(state => state.cart);
  const [checkAll, setCheckAll] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [order, setOrder] = useState({
    address: '',
    zip_code: '',
    city: '',
  });

  const [loadKey, setLoadKey] = useState(Date.now());
  const [show, setShow] = useState(false);

  const user = useSelector((state) => state.user.user);

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

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (stripeUrl) {
      window.location.href = stripeUrl;
    }
  }, [stripeUrl]);

  const getCartItems = (userId) => {
    const key = `cart_${userId}`;
    return JSON.parse(localStorage.getItem(key)) || [];
  };

  useEffect(() => {
    if (user && user.id) {
      const storedProducts = getCartItems(user.id);
      dispatch(setCart(storedProducts));
    }
  }, [dispatch, user]);

  const handleCheckAllChange = (e) => {
    const checked = e.target.checked;
    setCheckAll(checked);
    setOrderItems(checked ? products.map(item => ({ ...item, quantity: 1, totalPrice: item.price })) : []);
  };

  const handleCheckboxChange = (e, product) => {
    const checked = e.target.checked;
    if (checked) {
      setOrderItems([...orderItems, { ...product, quantity: 1, totalPrice: product.price }]);
    } else {
      setOrderItems(orderItems.filter(item => item.id !== product.id));
    }
  };

  const handleQuantityChange = (e, itemId) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (isNaN(newQuantity) || newQuantity < 1) {
      return;
    }

    dispatch(updateQuantity(itemId, newQuantity));
    setOrderItems(orderItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity, totalPrice: newQuantity * item.price } : item
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const orderData = {
        ...order,
        customer_id: user.id,
        customer_name: user.name,
        products: orderItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      dispatch(createCartItemsOrder(orderData));
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('An error occurred while submitting the order. Please try again later.');
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
          {products.map((item) => (
            <tr className="cart-item" key={item.id}>
              <td>
                <input
                  type="checkbox"
                  id={`order-checkbox-${item.id}`}
                  checked={orderItems.some(orderItem => orderItem.id === item.id)}
                  onChange={(e) => handleCheckboxChange(e, item)}
                />
                <label htmlFor={`order-checkbox-${item.id}`} className="ms-2">
                  Add to Order
                </label>
              </td>
              <td className="text-center">{item.productName}</td>
              <td className="text-center">
                {typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : 'N/A'}
              </td>
              <td className="text-center">
                <input
                  type="number"
                  min="1"
                  className="form-control form-control-sm"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(e, item.id)}
                />
              </td>
              <td className="text-center">
                {orderItems.some(orderItem => orderItem.id === item.id)
                  ? orderItems.find(orderItem => orderItem.id === item.id).quantity
                  : '-'}
              </td>
              <td className="text-center">
                {orderItems.some(orderItem => orderItem.id === item.id)
                  ? `$${parseFloat(orderItems.find(orderItem => orderItem.id === item.id).totalPrice).toFixed(2)}`
                  : '-'}
              </td>
              <td className="text-center">
                <Button size="sm" variant="danger" onClick={() => dispatch(removeFromCart(item.id))}>
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
