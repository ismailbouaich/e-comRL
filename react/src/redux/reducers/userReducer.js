import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAILURE,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAILURE,
    FETCH_USER_REQUEST, 
    FETCH_USER_SUCCESS, 
    FETCH_USER_FAILURE,
    LOGOUT_USER
} from '../constants/userConstants.js';

const initialState = {
    loading: false,
    user: null,
    error: '',
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_LOGIN_REQUEST:
        case USER_REGISTER_REQUEST:
        case FETCH_USER_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case USER_LOGIN_SUCCESS:
        case USER_REGISTER_SUCCESS:
        case FETCH_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                user: action.payload,
                error: '',
            };
        case USER_LOGIN_FAILURE:
        case USER_REGISTER_FAILURE:
        case FETCH_USER_FAILURE:
            return {
                ...state,
                loading: false,
                user: null,
                error: action.payload,
            };
        case LOGOUT_USER:
            return { ...state, user: null, error: null };
        default:
            return state;
    }
};

export default userReducer;
