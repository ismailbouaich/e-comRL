import { combineReducers } from 'redux';
import userReducer from './userReducer';
import productReducer from './productReducer';
import categoryReducer from './categoryReducer';
import orderReducer from './orderReducer';
import cartReducer from './cartReducer';
import { brandReducer } from './brandReducer';
import ratingReducer from './ratingReducer';
// Import other reducers as needed

const rootReducer = combineReducers({
    user: userReducer,
    product: productReducer,
    category: categoryReducer,
    order: orderReducer,
    cart: cartReducer,
    brand:brandReducer,
    ratings: ratingReducer,
    // Add other reducers here

});

export default rootReducer;