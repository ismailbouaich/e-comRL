import {
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_FAILURE,
    FETCH_ORDER_HISTORY_REQUEST,
    FETCH_ORDER_HISTORY_REQUEST_SUCCESS,
    FETCH_ORDER_HISTORY_REQUEST_FAILURE
} from '../constants/orderConstants';

const initialState = {
    loading: false,
    order: null,
    orders:[],
    error: '',
};

const orderReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_ORDER_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case FETCH_ORDER_HISTORY_REQUEST:
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
        case FETCH_ORDER_HISTORY_REQUEST_SUCCESS:
            return {
                ...state,
                loading: false,
                orders: action.payload,
                error: '',
            };
        case CREATE_ORDER_FAILURE:
        
            return {
                ...state,
                loading: false,
                order: null,
                error: action.payload,
            };
            case  FETCH_ORDER_HISTORY_REQUEST_FAILURE:
                return {
                    ...state,
                    loading: false,
                    error: action.payload,
                };
        default:
            return state;
    }
};

export default orderReducer;
