import axios from 'axios';

import {
    FETCH_BESTSELLING_PRODUCTS_REQUEST,
    FETCH_BESTSELLING_PRODUCTS_SUCCESS,
    FETCH_BESTSELLING_PRODUCTS_FAILURE,
    FETCH_PRODUCTS_FAILURE,
    FETCH_PRODUCTS_REQUEST,
    FETCH_PRODUCTS_SUCCESS,
     SEARCH_PRODUCTS_FAILURE, SEARCH_PRODUCTS_REQUEST, SEARCH_PRODUCTS_SUCCESS, SET_SELECTED_CATEGORY, 
     FETCH_PRODUCT_REQUEST,
     FETCH_PRODUCT_SUCCESS,
     FETCH_PRODUCT_FAILURE} from '../constants/productConstants';

export const fetchBestsellingProducts = () => async (dispatch) => {
    dispatch({ type: FETCH_BESTSELLING_PRODUCTS_REQUEST });
    try {
        const response = await axios.get(`/product/mostSelling`);
        dispatch({ type: FETCH_BESTSELLING_PRODUCTS_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: FETCH_BESTSELLING_PRODUCTS_FAILURE, payload: error.message });
    }
};

export const fetchProducts = () => async (dispatch) => {
    dispatch({ type: FETCH_PRODUCTS_REQUEST });
    try {
      const response = await axios.get(`/product/list`);
      dispatch({ type: FETCH_PRODUCTS_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: FETCH_PRODUCTS_FAILURE, payload: error.message });
    }
  };

  export const fetchProduct = (id) => async (dispatch) => {
    dispatch({ type: FETCH_PRODUCT_REQUEST });
  
    try {
      const response = await axios.get(`/product/${id}`);
      dispatch({ type: FETCH_PRODUCT_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: FETCH_PRODUCT_FAILURE, error });
    }
  };

  
export const setSelectedCategory = (category) => ({
    type: SET_SELECTED_CATEGORY,
    payload: category,
  });
  
  export const searchProducts = (searchKey) => async (dispatch) => {
    dispatch({ type: SEARCH_PRODUCTS_REQUEST });
    try {
      const response = await axios.get(`/search/${searchKey}`);
      dispatch({ type: SEARCH_PRODUCTS_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: SEARCH_PRODUCTS_FAILURE, payload: error.message });
    }
  };

