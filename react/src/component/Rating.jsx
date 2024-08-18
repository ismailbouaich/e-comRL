// RatingForm.js
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addRating } from '../redux/actions/ratingActions';
import StarRating from './StarRating';
import axios from 'axios';
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPicker from 'emoji-picker-react';
import { FaPaperPlane } from "react-icons/fa";
import { TbLocationCancel } from "react-icons/tb";



const RatingForm = ({ productId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const emojiPickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    if (comment.trim() === '') return;
    
    const ratingData = { rating, comment, user_id: user?.id, product_id: productId };
    dispatch(addRating(productId, ratingData));
    try {
      await axios.post(`/product/comment/${productId}`, {
        product_id: productId,
        body: comment
      });
      setRating(0);
      setComment('');
      window.dispatchEvent(new CustomEvent('commentAdded'));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleCancel = () => {
    setComment('');
    setRating(0);
    setShowEmojiPicker(false);
  };

  const onEmojiClick = (emojiObject) => {
    setComment(prevComment => prevComment + emojiObject.emoji);
  };

  return (
    <form onSubmit={handleRatingSubmit} className="mt-4 max-w-full">
      <div className="flex items-start">
        <img src='images/user.png' alt="User Avatar" className="w-10 h-10 rounded-full mr-3" />
        <div className="flex-grow relative">
          <div className="border border-gray-300 rounded-lg p-3">
            <textarea
              className="w-full resize-none outline-none"
              rows="1"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center space-x-2">
                <BsEmojiSmile 
                  className="text-gray-500 cursor-pointer" 
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                />
                <StarRating rating={rating} setRating={setRating} />
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  type="button" 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={handleCancel}
                >
                                    <TbLocationCancel/>

                </button>
                <button
                  type="submit"
                  className={` text-black px-4 py-1 rounded-full ${
                    comment.trim() === '' ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={comment.trim() === ''}
                >
                  <FaPaperPlane/>
                </button>
              </div>
            </div>
          </div>
          {showEmojiPicker && (
            <div 
              ref={emojiPickerRef} 
              className="absolute z-10 left-0 right-0 mt-2"
              style={{ maxWidth: '100%' }}
            >
              <EmojiPicker 
                onEmojiClick={onEmojiClick} 
                width="100%" 
                height="250px"
                previewConfig={{ showPreview: false }}
              />
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default RatingForm;