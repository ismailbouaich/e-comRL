import axios from "axios";

import {FETCH_BRANDS_REQUEST,FETCH_BRANDS_SUCCESS,FETCH_BRANDS_FAILURE} from "../constants/brandConstants";


    export const fetchBrands=()=> async(dispatch)=>{

        dispatch({type:FETCH_BRANDS_REQUEST});

        try{
          const response = await axios.get(`/brands`);

          dispatch({type:FETCH_BRANDS_SUCCESS,payload:response.data})
        }catch(error){
          dispatch({type:FETCH_BRANDS_FAILURE,payload:error.message})
        }

        
    }