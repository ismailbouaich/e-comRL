import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';
import { IoBagCheckOutline } from 'react-icons/io5';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart, updateQuantity, setCart } from '../redux/actions/cartActions';
import { X } from 'lucide-react';
import { ScrollArea } from '../components/ui/scroll-area';

import NotFoundImage from '../assets/images/empty.png';
import { useTranslation } from 'react-i18next';

const ShoppingCart = () => {
  const dispatch = useDispatch();
  const products = useSelector(state => state.cart.cart);
  const user = useSelector(state => state.user.user);

  const getCartItems = (userId) => {
    const key = `cart_${userId}`;
    return JSON.parse(localStorage.getItem(key)) || [];
  };

  useEffect(() => {

    const fetchproductcart= async()=>{
      if (user && user.id) {
        const storedProducts = getCartItems(user.id);
        dispatch(setCart(storedProducts));
      }
    }
    fetchproductcart();
    window.addEventListener('productAdded', fetchproductcart); // Add event listener

    return () => {
      window.removeEventListener('productAdded', fetchproductcart); // Cleanup
    };
  }, [dispatch, user]);

  const handleDecrement = (product) => {
    if (product.quantity > 1) {
      dispatch(updateQuantity(product.id, product.quantity - 1));
    } else {
      dispatch(removeFromCart(product.id));
    }
  };


  const handleIncrement = (productId, currentQuantity) => {
    dispatch(updateQuantity(productId, currentQuantity + 1));
  };

  return (
    <Sheet>
      <SheetTrigger className="flex justify-center items-center">
        <IoBagCheckOutline className="text-[32px] text-black/25" />
      </SheetTrigger>
      <SheetContent className="flex flex-col p-4">
        <div className="mt-20 mb-35 text-center text-2xl">
          <h1 className="text-4xl font-semibold">Shopping Cart</h1>
        </div> 
        <ScrollArea>
        <nav className="flex flex-col justify-center items-center gap-8">
          {products.length > 0 ? (
            products.map((product, index) => (
              <div key={index} className="flex items-center justify-between w-full p-4 bg-gray-100 rounded-md shadow-md">
                <img src={product.image} alt={product.productName} className="w-16 h-16 object-cover" />
                <div className="flex flex-col ml-4">
                  <span className="text-lg font-semibold">{product.productName}</span>
                  <span className="text-sm text-gray-500">Quantity: {product.quantity}</span>
                  <span className="text-lg font-semibold">${product.price}</span>
                  <div className="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
                    <button
                      data-action="decrement"
                      className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none"
                      onClick={() => handleDecrement(product, product.quantity)}
                    >
                      <span className="m-auto text-2xl font-thin">−</span>
                    </button>
                    <input
                      type="number"
                      className="outline-none focus:outline-none text-center w-full bg-gray-300 font-semibold text-md hover:text-black focus:text-black md:text-base cursor-default flex items-center text-gray-700"
                      name="custom-input-number"
                      value={product.quantity}
                      readOnly
                    />
                    <button
                      data-action="increment"
                      className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer outline-none"
                      onClick={() => handleIncrement(product.id, product.quantity)}
                    >
                      <span className="m-auto text-2xl font-thin">+</span>
                    </button>
                  </div>
                </div>
                <button onClick={() => dispatch(removeFromCart(product.id))}>
                  <X />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center">
              <img src={NotFoundImage} alt="Not Found" className="h-48 w-auto" />
              <p>Your cart is empty.</p>
            </div>
          )}
        </nav>
        </ScrollArea>
        {products.length > 0 && (
          <div className="mt-8">
            <Link 
              to={{
                pathname: "/checkout",
                state: { products }
              }} 
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Proceed To Checkout
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ShoppingCart;
