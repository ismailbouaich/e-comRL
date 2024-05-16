import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./category.scss"

const Category = ({onSelectCategory}) => {

    const[categories,setCategories]=useState([]);

    useEffect(() => {
        // Fetch categories and products here
        axios.get('/categories')
          .then((response) => {
            setCategories(response.data);
          })
          .catch((error) => {
            console.error('Error fetching categories:', error);
          })},[]);
  return (
     <div className="category-list">
      {categories.map((category) => (
        <div key={category.id} onClick={() => onSelectCategory(category.id)} className="category-item">
          {category.name}
        </div>
      ))}
    </div>
  )
}

export default Category;
