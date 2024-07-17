import axios from "axios";






export const fetchRating = (productId) => async (dispatch) => {
    dispatch({ type: 'FETCH_RATING_REQUEST' });
    try {
        const response = await axios.get(`/product/ratings/${productId}`);
        dispatch({ type: 'FETCH_RATINGS_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({ type: 'FETCH_RATINGS_FAILURE', payload: error.message });
    }
};

export const addRating = (productId, ratingData) => async (dispatch, getState) => {
    try {
      const user = getState().user.user; // Get user data from the state
      const response = await axios.post(`/product/ratings/${productId}`, {
        ...ratingData,
        product_id: productId,
        user_id: user.id,
      });
      dispatch({ type: 'ADD_RATING_SUCCESS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'ADD_RATING_FAILURE', payload: error.message });
    }
  };
