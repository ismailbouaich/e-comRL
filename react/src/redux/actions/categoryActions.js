import axios from "axios";
import { FETCH_CATEGORIES_FAILURE, FETCH_CATEGORIES_REQUEST, FETCH_CATEGORIES_SUCCESS } from "../constants/categoryConstants";

export const fetchCategories = () => async (dispatch) => {
    dispatch({ type: FETCH_CATEGORIES_REQUEST });
    try {
      const response = await axios.get(`/categories`);
      dispatch({ type: FETCH_CATEGORIES_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: FETCH_CATEGORIES_FAILURE, payload: error.message });
    }
  };