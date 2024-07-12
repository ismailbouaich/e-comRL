import axios from 'axios';

import { CREATE_ORDER_REQUEST ,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_FAILURE,} from '../constants/orderConstants';

export const createOrder = (orderData) => async (dispatch) => {
    dispatch({ type: CREATE_ORDER_REQUEST});
    try {
        const response = await axios.post(`/order/create`, orderData);
        dispatch({ type: CREATE_ORDER_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: CREATE_ORDER_FAILURE, payload: error.message });
    }
};