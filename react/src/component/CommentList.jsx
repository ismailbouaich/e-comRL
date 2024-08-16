// CommentList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommentList= ({ productId, }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`/product/comments/${productId}`);
        setComments(response.data.comments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
    window.addEventListener('commentAdded', fetchComments); // Add event listener

    return () => {
      window.removeEventListener('commentAdded', fetchComments); // Cleanup
    };
  }, [productId]);

  return (
    <div>
      <h3>Comments</h3>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <strong>{comment.user.name}</strong>: {comment.body}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentList;
