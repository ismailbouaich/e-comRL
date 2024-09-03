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
    LOGOUT_USER,
    USER_FORGET_PASSWORD_REQUEST,
    USER_FORGET_PASSWORD_SUCCESS,
    USER_FORGET_PASSWORD_FAILURE
} from '../constants/userConstants.js';

const initialState = {
    loading: false,
    user: null,
    error: '',
    forgetPassword: {
        loading: false,
        message: '',
        error: ''
    }
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_LOGIN_REQUEST:
        case USER_REGISTER_REQUEST:
        case FETCH_USER_REQUEST:
            return {
                ...state,
                loading: true,
                error: '',
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
        case USER_FORGET_PASSWORD_REQUEST:
            return {
                ...state,
                forgetPassword: {
                    loading: true,
                    message: '',
                    error: ''
                }
            };
        case USER_FORGET_PASSWORD_SUCCESS:
            return {
                ...state,
                forgetPassword: {
                    loading: false,
                    message: action.payload,
                    error: ''
                }
            };
        case USER_FORGET_PASSWORD_FAILURE:
            return {
                ...state,
                forgetPassword: {
                    loading: false,
                    message: '',
                    error: action.payload
                }
            };
        case LOGOUT_USER:
            return { 
                ...state, 
                user: null, 
                error: null, 
                forgetPassword: {
                    loading: false,
                    message: '',
                    error: ''
                }
            };
        default:
            return state;
    }
};

export default userReducer;