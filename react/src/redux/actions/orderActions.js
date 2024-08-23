import axios from 'axios';

import { CREATE_ORDER_REQUEST ,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_FAILURE,
    FETCH_ORDER_HISTORY_REQUEST,
    FETCH_ORDER_HISTORY_REQUEST_SUCCESS,
    FETCH_ORDER_HISTORY_REQUEST_FAILURE

} from '../constants/orderConstants';

export const createOrder = (orderData) => async (dispatch) => {
    dispatch({ type: CREATE_ORDER_REQUEST});
    try {
        const response = await axios.post(`/order/create`, orderData);
        dispatch({ type: CREATE_ORDER_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: CREATE_ORDER_FAILURE, payload: error.message });
    }
};




export const orderHistory = (userId) => async (dispatch) => {
    dispatch({ type: FETCH_ORDER_HISTORY_REQUEST
    });
    try {
        const response = await axios.get(`/orders/${userId}`);
        dispatch({ type: FETCH_ORDER_HISTORY_REQUEST_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: FETCH_ORDER_HISTORY_REQUEST_FAILURE, payload: error.message });
    }
};


