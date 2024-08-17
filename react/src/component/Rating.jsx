import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addRating } from '../redux/actions/ratingActions';
import StarRating from './StarRating';
import axios from 'axios';

const RatingForm = ({ productId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating before submitting.");
      return;
    }
    const ratingData = { rating, comment, user_id: user?.id, product_id: productId };
    dispatch(addRating(productId, ratingData));
    try {
      await axios.post(`/product/comment/${productId}`, {
        product_id: productId,
        body: comment
      });
      // Reset form fields
      setRating(0);
      setComment('');
      window.dispatchEvent(new CustomEvent('commentAdded'));
    } catch (error) {
      console.error('Error adding comment:', error);
      // Optionally, you can handle errors here
    }
  };

  return (
    <form onSubmit={handleRatingSubmit} className="mt-4 max-w-md mx-auto p-4 border rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Leave a Review</h2>
      <div className="mb-4">
        <StarRating rating={rating} setRating={setRating} />
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