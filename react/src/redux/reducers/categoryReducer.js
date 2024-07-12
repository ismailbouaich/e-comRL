// categoryReducer.js

import { FETCH_CATEGORIES_FAILURE, FETCH_CATEGORIES_REQUEST, FETCH_CATEGORIES_SUCCESS } from "../constants/categoryConstants";

  
  
  const initialState = {
    loading: false,
    categories: [],
    error: '',
  };
  
  const categoryReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_CATEGORIES_REQUEST:
        return { ...state, loading: true, error: '' };
      case FETCH_CATEGORIES_SUCCESS:
        return { ...state, loading: false, categories: action.payload };
      case FETCH_CATEGORIES_FAILURE:
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export default categoryReducer;
  