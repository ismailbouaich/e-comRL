
//..reducers/cartReducer
import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_QUANTITY,
  SET_CART,
  CREATE_CART_ITEMS_ORDER_REQUEST,
  CREATE_CART_ITEMS_ORDER_SUCCESS,
  CREATE_CART_ITEMS_ORDER_FAILURE,
} from '../constants/cartitemsConstants';

const initialState = {
  cart: [],
  loading: false,
  error: null,
  stripeUrl: null,
  stripeSessionId: null,
};



const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      return {
        ...state,
        cart: [...state.cart, action.payload],
      };
    case REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload),
      };
    case UPDATE_QUANTITY:
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case SET_CART:
      return {
        ...state,
        cart: action.payload,
      };
    case CREATE_CART_ITEMS_ORDER_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case CREATE_CART_ITEMS_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        stripeUrl: action.payload.stripe_url,
        stripeSessionId: action.payload.session_id,
      };
    case CREATE_CART_ITEMS_ORDER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default cartReducer