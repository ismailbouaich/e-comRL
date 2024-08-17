// components/StarRating.js
import React, { useState } from 'react';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

const StarRating = ({ rating, setRating }) => {
  const [hover, setHover] = useState(null);

  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => {
        const fullRatingValue = index + 1;
        const halfRatingValue = index + 0.5;

        return (
          <label key={index} className="cursor-pointer">
            <input
              type="radio"
              name="rating"
              value={fullRatingValue}
              onClick={() => setRating(fullRatingValue)}
              className="hidden"
            />
            <span
              className="text-2xl"
              onMouseEnter={() => setHover(fullRatingValue)}
              onMouseLeave={() => setHover(null)}
            >
              {/* Display full star */}
              {hover >= fullRatingValue || rating >= fullRatingValue ? (
                <FaStar className="text-yellow-500" />
              ) : ( 
                // Display half star or empty star
                (hover >= halfRatingValue || rating >= halfRatingValue) ? (
                  <FaStarHalfAlt className="text-yellow-500" />
                ) : (
                  <FaStar className="text-gray-300" />
                )
              )}
            </span>
          </label>
        );
      })}
    </div>
  );
};

export default StarRating;
