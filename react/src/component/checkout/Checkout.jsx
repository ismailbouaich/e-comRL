import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart, createCartItemsOrder } from '../../redux/actions/cartActions';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';

import {Button} from "../../components/ui/button"
import {Input} from "../../components/ui/input"


import "./style.css"
import BingMap from '../BingMap';
import { createOrder } from '../../redux/actions/orderActions';
import axios from 'axios';


const Checkout = () => {

  const [order, setOrder] = useState({
    first_name: '',
    last_name: '',
    address: '',
    phone: '',
    email: '',
    city: '',
    zip_code: '',
    country: '',
    latitude:'',
   longitude:''
  });


  const stripe_url = useSelector((state) => state.order.order?.stripe_url);
  const [shippingCost, setShippingCost] = useState(0.0);
  const [tempShippingCost, setTempShippingCost] = useState(0.0);

  const [tempLocationData, setTempLocationData] = useState(null);

  const [loadKey, setLoadKey] = useState(Date.now());
  const cartItems = useSelector((state) => state.cart.cart);
  const dispatch = useDispatch();

  const orderLoading = useSelector((state) => state.order.loading);
  

  const user = useSelector((state) => state.user.user);

  const handleLocationSelect = async (address, zip_code, adminDistrict2, country , latitude,
    longitude,) => {
    setTempLocationData({ address, zip_code, city: adminDistrict2, country });
  
    try {
      const response = await axios.post('/calculate-shipping', { city: adminDistrict2, country });
      setShippingCost(parseFloat(response.data.shippingCost));
    } catch (error) {
      console.error('Error calculating shipping cost:', error.message);
     
      setTempShippingCost(0.0);
    }
    setOrder(prevOrder => ({
      ...prevOrder,
      latitude,
      longitude,
    }));
  };

  const handleConfirmLocation = () => {
    if (tempLocationData) {
      setOrder(prevOrder => ({
        ...prevOrder,
        ...tempLocationData
      }));
      setShippingCost(tempShippingCost);
    }
   
  };

  useEffect(() => {
    if (stripe_url) {
      window.location.href = stripe_url;
    }
  }, [stripe_url]);

  useEffect(() => {
    if (!orderLoading && stripe_url) {
      dispatch(clearCart());
    }
  }, [orderLoading, stripe_url, dispatch]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const orderData = {
        ...order,
        customer_id: user.id,
        products: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      dispatch(createOrder(orderData));
     
     

    } catch (error) {
      console.error('Error submitting order:', error);
      alert('An error occurred while submitting the order. Please try again later.');
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrder((prev) => ({ ...prev, [name]: value }));
  };



  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };
  
  const calculateTotal = () => {
    const subtotal = parseFloat(calculateSubtotal());
    const total = subtotal + shippingCost;
    return total.toFixed(2);
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex flex-col lg:flex-row justify-between">
        <div className="lg:w-1/2">
          <h2 className="text-2xl font-semibold mb-4">Shipping Address</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="text"
                name="first_name"
                value={order.first_name}
                onChange={handleInputChange}
                placeholder="First Name *"
                
             
              />
              <Input
                type="text"
                name="last_name"
                value={order.last_name}
                onChange={handleInputChange}
                placeholder="Last Name *"
                
               
              />
            </div>
          
            <input
              type="text"
              name="phone"
              value={order.phone}
              onChange={handleInputChange}
              placeholder="Phone/Mobile *"
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="email"
              name="email"
              value={order.email}
              onChange={handleInputChange}
              placeholder="Email *"
              className="border p-2 rounded w-full"
              required
            /> 
             <input
              type="text"
              name="address"
              value={order.address}
              onChange={handleInputChange}
              placeholder="Address *"
              className="border p-2 rounded w-full"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="city"
                value={order.city}
                onChange={handleInputChange}
                placeholder="City/Town"
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                name="zip_code"
                value={order.zip_code}
                onChange={handleInputChange}
                placeholder="Postcode"
                className="border p-2 rounded w-full"
              />
            </div>
          
             <Dialog>
              <DialogTrigger asChild>
                <Button className=" text-white w-full py-2 mt-4 rounded">
                  Place Order
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Your Order</DialogTitle>
                  <DialogDescription>
                  <BingMap key={loadKey} onLocationSelect={handleLocationSelect} />
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>

                <DialogTrigger asChild>
                <Button onClick={handleConfirmLocation}>
              Confirm
            </Button>
                  </DialogTrigger>
                  
                  <DialogTrigger asChild>
                    <button className="bg-gray-500 text-white py-2 px-4 rounded">
                      Cancel
                    </button>
                  </DialogTrigger>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </form>
        </div>
        <div className="lg:w-1/3 mt-8 lg:mt-0 lg:ml-8">
          <h2 className="text-2xl font-semibold mb-4">Your Order</h2>
          <div className="border p-4 rounded">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <img src={item.image} alt={item.productName} className="w-16 h-16 rounded mr-4" />
                  <div>
                    <p>{item.productName}</p>
                    <p className="text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p>${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          <div className="flex justify-between items-center mt-4 border-t pt-4">
            <p className="font-semibold">Subtotal</p>
            <p>${calculateSubtotal()}</p>
          </div>
          <div className="flex justify-between items-center mt-4 border-t pt-4">
            <p className="font-semibold">Shipping</p>
            <p>${shippingCost.toFixed(2)}</p>
          </div>
          <div className="flex justify-between items-center mt-4 border-t pt-4">
            <p className="font-semibold">Total</p>
            <p>${calculateTotal()}</p>
          </div>
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white w-full py-2 mt-4 rounded"
              disabled={orderLoading}
            >
             {orderLoading ? 'Loading...' : 'Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
