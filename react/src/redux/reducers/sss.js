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
    product: {},
    pagination: {},
    relatedByCategory: [],
    relatedByBrand: [],
    searchResults: [],
    favorites: [], // Ensure this property exists
    selectedCategory: null,
    error: '',
};

const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_BESTSELLING_PRODUCTS_REQUEST:
        case FETCH_PRODUCTS_REQUEST:
        case SEARCH_PRODUCTS_REQUEST:
        case FETCH_PRODUCT_REQUEST:
        case FETCH_FAVORITE_PRODUCT_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case SET_FAVORITE_PRODUCT_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case FETCH_BESTSELLING_PRODUCTS_SUCCESS:
        case FETCH_PRODUCTS_SUCCESS:
            return {
                ...state,
                loading: false,
                products: action.payload.data, 
                pagination: {
                    current_page: action.payload.current_page,
                    last_page: action.payload.last_page,
                },
                error: '',
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
                    favorites: action.payload, // Update favorites with the fetched data
                    error: '',
                };
        case FETCH_BESTSELLING_PRODUCTS_FAILURE:
        case FETCH_PRODUCTS_FAILURE:
        case SEARCH_PRODUCTS_FAILURE:
        case FETCH_PRODUCT_FAILURE:
        case SET_FAVORITE_PRODUCT_FAILURE:
        case FETCH_FAVORITE_PRODUCT_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case SET_SELECTED_CATEGORY:
            return {
                ...state,
                selectedCategory: action.payload,
            };
        default:
            return state;
    }
};

export default productReducer;
