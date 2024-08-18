// components/StarRating.js
import React, { useState } from 'react';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

const StarRating = ({ rating, setRating }) => {
  const [hover, setHover] = useState(null);

  const handleClick = (value) => {
    if (rating === value) {
      // If clicking on the same value, clear the rating
      setRating(0);
    } else {
      setRating(value);
    }
  };

  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        const isHalfStar = (hover !== null ? hover : rating) === ratingValue - 0.5;
        const isFullStar = (hover !== null ? hover : rating) >= ratingValue;
        
        return (
          <label key={index} className="cursor-pointer relative">
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              className="hidden"
            />
            <span className="text-2xl inline-block w-full">
              {isFullStar ? (
                <FaStar className="text-yellow-500" />
              ) : isHalfStar ? (
                <FaStarHalfAlt className="text-yellow-500" />
              ) : (
                <FaStar className="text-gray-300" />
              )}
            </span>
            <span 
              className="absolute inset-0 w-1/2"
              onMouseEnter={() => setHover(ratingValue - 0.5)}
              onMouseLeave={() => setHover(null)}
              onClick={() => handleClick(ratingValue - 0.5)}
            />
            <span 
              className="absolute inset-0 left-1/2 w-1/2"
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(null)}
              onClick={() => handleClick(ratingValue)}
            />
          </label>
        );
      })}
    </div>
  );
};

export default StarRating;