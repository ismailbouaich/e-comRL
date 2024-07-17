const initialState = {
    ratings: [],
    loading: false,
    error: null,
};

const ratingReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_RATING_REQUEST':
            return { ...state, loading: true, error: null };
        case 'FETCH_RATINGS_SUCCESS':
            return { ...state, loading: false, ratings: action.payload };
        case 'FETCH_RATINGS_FAILURE':
            return { ...state, loading: false, error: action.payload };
        case 'ADD_RATING_SUCCESS':
            return { ...state, ratings: [...state.ratings, action.payload] };
        case 'ADD_RATING_FAILURE':
            return { ...state, error: action.payload };
        default:
            return state;
    }
};

export default ratingReducer;
