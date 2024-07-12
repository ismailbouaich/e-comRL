import axios from 'axios';
import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_QUANTITY,
  SET_CART,
  CREATE_CART_ITEMS_ORDER_REQUEST,
  CREATE_CART_ITEMS_ORDER_SUCCESS,
  CREATE_CART_ITEMS_ORDER_FAILURE,
} from '../constants/cartitemsConstants';

export const addToCart = (product) => ({
  type: ADD_TO_CART,
  payload: product,
});

export const removeFromCart = (productId) => ({
  type: REMOVE_FROM_CART,
  payload: productId,
});

export const updateQuantity = (productId, quantity) => ({
  type: UPDATE_QUANTITY,
  payload: { productId, quantity },
});

export const setCart = (products) => ({
  type: SET_CART,
  payload: products,
});

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
