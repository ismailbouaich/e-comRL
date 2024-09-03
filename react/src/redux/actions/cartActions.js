import axios from 'axios';
import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_QUANTITY,
  SET_CART,
  CREATE_CART_ITEMS_ORDER_REQUEST,
  CREATE_CART_ITEMS_ORDER_SUCCESS,
  CREATE_CART_ITEMS_ORDER_FAILURE,
  CLEAR_CART 
} from '../constants/cartitemsConstants';

export const addToCart = (product) => (dispatch, getState) => {
  const userId = getState().user.user.id;
  const key = `cart_${userId}`;
  
  dispatch({
    type: ADD_TO_CART,
    payload: product,
  });

  const updatedCart = getState().cart.cart;
  localStorage.setItem(key, JSON.stringify(updatedCart));
};

export const removeFromCart = (productId) => (dispatch, getState) => {
  const userId = getState().user.user.id;
  const key = `cart_${userId}`;
  
  dispatch({
    type: REMOVE_FROM_CART,
    payload: productId,
  });

  const updatedCart = getState().cart.cart;
  localStorage.setItem(key, JSON.stringify(updatedCart));
};

export const updateQuantity = (productId, newQuantity) => (dispatch, getState) => {
  const userId = getState().user.user.id;
  const key = `cart_${userId}`;
  
  dispatch({
    type: UPDATE_QUANTITY,
    payload: { productId, newQuantity },
  });

  const updatedCart = getState().cart.cart;
  localStorage.setItem(key, JSON.stringify(updatedCart));
};

export const setCart = (products) => ({
  type: SET_CART,
  payload: products,
});

export const clearCart = () => (dispatch, getState) => {
  const userId = getState().user.user.id;
  const key = `cart_${userId}`;

  localStorage.removeItem(key);

  dispatch({
    type: CLEAR_CART,
    payload: userId,
  });
};

export const createCartItemsOrder = (orderData) => async (dispatch) => {
  dispatch({ type: CREATE_CART_ITEMS_ORDER_REQUEST });
  try {
    const response = await axios.post(`/order/create`, orderData);
    dispatch({
      type: CREATE_CART_ITEMS_ORDER_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: CREATE_CART_ITEMS_ORDER_FAILURE,
      payload: error.message,
    });
  }
};
