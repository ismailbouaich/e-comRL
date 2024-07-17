// components/RatingForm.js

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addRating } from '../redux/actions/ratingActions';
import StarRating from './StarRating';

const RatingForm = ({ productId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const handleRatingSubmit = (e) => {
    e.preventDefault();
    const ratingData = { rating, comment, user_id: user?.id, product_id: productId };
    dispatch(addRating(productId, ratingData));
    setRating(0);
    setComment('');
  };

  return (
    <form onSubmit={handleRatingSubmit} className="mt-4 max-w-md mx-auto p-4 border rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Leave a Review</h2>
      <div className="mb-4">
        <StarRating setRating={setRating} />
      </div>
      <div className="mb-4">
        <textarea
          className="w-full p-2 border rounded"
          rows="4"
          placeholder="Leave a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Submit Rating
      </button>
    </form>
  );
};

export default RatingForm;
