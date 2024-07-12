import {FETCH_BRANDS_REQUEST,FETCH_BRANDS_SUCCESS,FETCH_BRANDS_FAILURE} from "../constants/brandConstants";


const initialState={
    loading:false,
    brands:[],
    error:'',
};

export const brandReducer=(state=initialState,action)=>{

    switch (action.type) {
        case FETCH_BRANDS_REQUEST:
            return{...state,loading:true,error:''}
        case FETCH_BRANDS_SUCCESS:
            return{...state,loading:false,brands:action.payload}
            case FETCH_BRANDS_FAILURE:
                return{...state,loading:false,error:action.payload}
            
    
        default:
            return state
           
    }
}
