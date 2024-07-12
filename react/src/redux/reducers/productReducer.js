import {
    FETCH_BESTSELLING_PRODUCTS_REQUEST,
    FETCH_BESTSELLING_PRODUCTS_SUCCESS,
    FETCH_BESTSELLING_PRODUCTS_FAILURE,
    SET_SELECTED_CATEGORY,
    SEARCH_PRODUCTS_REQUEST,
    SEARCH_PRODUCTS_SUCCESS,
    SEARCH_PRODUCTS_FAILURE,
    FETCH_PRODUCTS_REQUEST,
    FETCH_PRODUCTS_SUCCESS,
    FETCH_PRODUCTS_FAILURE,
    FETCH_PRODUCT_REQUEST,
    FETCH_PRODUCT_SUCCESS,
    FETCH_PRODUCT_FAILURE,
} from '../constants/productConstants';

const initialState = {
    loading: false,
    products: [],
    product: {},
    searchResults: [],
    selectedCategory: null,
    error: '',
};

const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_BESTSELLING_PRODUCTS_REQUEST:
        case FETCH_PRODUCTS_REQUEST:
        case SEARCH_PRODUCTS_REQUEST:
        case FETCH_PRODUCT_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case FETCH_BESTSELLING_PRODUCTS_SUCCESS:
        case FETCH_PRODUCTS_SUCCESS:
            return {
                ...state,
                loading: false,
                products: action.payload,
                error: '',
            };
            case FETCH_PRODUCT_SUCCESS:
            return {
                ...state,
                loading: false,
                product: action.payload,
                error: '',
            };
        case SEARCH_PRODUCTS_SUCCESS:
                return { 
                    ...state,
                     loading: false,
                      searchResults: action.payload 
                };
        case FETCH_BESTSELLING_PRODUCTS_FAILURE:
        case FETCH_PRODUCTS_FAILURE:
        case SEARCH_PRODUCTS_FAILURE:
            return {
                ...state,
                loading: false,
                products: [],
                error: action.payload,
            };
            case FETCH_PRODUCT_FAILURE:
            return {
                ...state,
                loading: false,
                product: false,
                error: action.payload,
            };
        case SET_SELECTED_CATEGORY:
                return { 
                    ...state,
                     selectedCategory: 
                     action.payload
                     };
        default:
            return state;
    }
};

export default productReducer;