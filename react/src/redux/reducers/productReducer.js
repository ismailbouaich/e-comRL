import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  SEARCH_PRODUCTS_REQUEST,
  SEARCH_PRODUCTS_SUCCESS,
  SEARCH_PRODUCTS_FAILURE,
  FETCH_PRODUCT_REQUEST,
  FETCH_PRODUCT_SUCCESS,
  FETCH_PRODUCT_FAILURE,
  SET_FAVORITE_PRODUCT_REQUEST,
  SET_FAVORITE_PRODUCT_SUCCESS,
  SET_FAVORITE_PRODUCT_FAILURE,
  FETCH_FAVORITE_PRODUCT_REQUEST,
  FETCH_FAVORITE_PRODUCT_SUCCESS,
  FETCH_FAVORITE_PRODUCT_FAILURE,
} from '../constants/productConstants';

const initialState = {
  loading: false,
  products: [],
  searchResults: [],
  product: {},
  relatedByCategory: [],
  relatedByBrand: [],
  favorites: [],
  pagination: {},
  error: '',
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PRODUCTS_REQUEST:
    case FETCH_PRODUCT_REQUEST:
    case SEARCH_PRODUCTS_REQUEST:
    case SET_FAVORITE_PRODUCT_REQUEST:
    case FETCH_FAVORITE_PRODUCT_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        products: action.payload.data,
        pagination: {
          currentPage: action.payload.current_page,
          lastPage: action.payload.last_page,
        },
      };
    case FETCH_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        product: action.payload.product,
        relatedByCategory: action.payload.relatedByCategory,
        relatedByBrand: action.payload.relatedByBrand,
        error: '',
      };
    case SEARCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        searchResults: action.payload,
      };
    case SET_FAVORITE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        favorites: state.favorites.includes(action.payload)
          ? state.favorites.filter((id) => id !== action.payload)
          : [...state.favorites, action.payload],
      };
    case FETCH_FAVORITE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        favorites: action.payload,
      };
    case FETCH_PRODUCTS_FAILURE:
    case SEARCH_PRODUCTS_FAILURE:
    case SET_FAVORITE_PRODUCT_FAILURE:
    case FETCH_FAVORITE_PRODUCT_FAILURE:
    case FETCH_PRODUCT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default productReducer;
