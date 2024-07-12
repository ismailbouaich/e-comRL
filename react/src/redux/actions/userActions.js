// src/redux/actions/userActions.js
import axios from 'axios';
import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAILURE,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAILURE,
    FETCH_USER_REQUEST,
    FETCH_USER_SUCCESS,
    FETCH_USER_FAILURE,
    LOGOUT_USER, 
} from '../constants/userConstants';

export const loginUser = (email, password) => async (dispatch) => {
    dispatch({ type: USER_LOGIN_REQUEST });
    try {
        const response = await axios.post('/login', { email, password });
        localStorage.setItem('token', response.data.token);
        dispatch({ type: USER_LOGIN_SUCCESS, payload: response.data.user });
    } catch (error) {
        dispatch({ type: USER_LOGIN_FAILURE, payload: error.response?.data?.message || 'Something went wrong' });
    }
};

export const fetchUserData = () => async (dispatch) => {
    dispatch({ type: FETCH_USER_REQUEST });
    try {
      const response = await axios.get(`/user`);
      dispatch({ type: FETCH_USER_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: FETCH_USER_FAILURE, payload: error.message });
      
    }
  };

  export const logoutUser = () => (dispatch) => {
    localStorage.removeItem('token');
    dispatch({ type: LOGOUT_USER });
  };
export const registerUser = (userData) => async (dispatch) => {
    dispatch({ type: USER_REGISTER_REQUEST });
    try {
        const response = await axios.post(`/register`, userData);
        localStorage.setItem('token', response.data.token);
        dispatch({ type: USER_REGISTER_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: USER_REGISTER_FAILURE, payload: error.message });
    }
};
