import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchCategories } from '../redux/actions/categoryActions';
import { selectCategories, selectLoading, selectError } from '../redux/selectors/categorySelectors';

const Category = ({onSelectCategory}) => {

  const dispatch = useDispatch();
  const categories = useSelector(selectCategories)||[];
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="flex-shrink-0 rtl:pl-24 hidden lg:block w-96">
     


        {categories.map((item,index)=>{
          
            
                    <label className="flex items-center space-x-2">
        <input type="checkbox" className="form-checkbox" />
        <span>{item}</span>
        </label>
          
        })}
     
       
     
      
    </div>
  );
  
}

export default Category;
