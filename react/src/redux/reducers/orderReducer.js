import {
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_FAILURE,
} from '../constants/orderConstants';

const initialState = {
    loading: false,
    order: null,
    error: '',
};

const orderReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_ORDER_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case CREATE_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                order: action.payload,
                error: '',
            };
        case CREATE_ORDER_FAILURE:
            return {
                ...state,
                loading: false,
                order: null,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default orderReducer;
