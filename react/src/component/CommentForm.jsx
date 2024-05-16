// CommentForm.js

import React, { useState } from 'react';
import axios from 'axios';

const CommentForm = ({ productId }) => {
  const [commentBody, setCommentBody] = useState('');
  

  const handleSubmit = async (e) => {
    e.preventDefault();
 
    try {
      await axios.post(`/product/comment/${productId}`, {
        product_id:productId,
        body: commentBody
      });
      // Optionally, you can handle success or reset form fields here
      window.dispatchEvent(new CustomEvent('commentAdded'));
    } catch (error) {
      console.error('Error adding comment:', error);
      // Optionally, you can handle errors here
    }
  };

  return (
    <form onSubmit={handleSubmit}>
    
      <textarea
        value={commentBody}
        onChange={(e) => setCommentBody(e.target.value)}
        placeholder="Write your comment..."
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default CommentForm;
