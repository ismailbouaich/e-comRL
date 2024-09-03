import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsThreeDotsVertical } from 'react-icons/bs';
import userimg from '../assets/images/user.png';

import { ScrollArea } from '../components/ui/scroll-area';



const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 1) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
};
const CommentList = ({ productId }) => {
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
    window.addEventListener('commentAdded', fetchComments);

    return () => {
      window.removeEventListener('commentAdded', fetchComments);
    };
  }, [productId]);

  return (
    <div className="mt-4 h-[400px]"> {/* Adjust the height as needed */}
    <ScrollArea className="h-full">
      <div className="pr-4"> {/* Add right padding for scrollbar */}
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-start mb-4">
            <img src={comment.user.avatar || userimg} alt={comment.user.name} className="w-10 h-10 rounded-full mr-3" />
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold">{comment.user.name}</span>
                  <span className="text-gray-500 text-sm ml-2">{formatDate(comment.created_at)}</span>
                </div>
                <BsThreeDotsVertical className="text-gray-500 cursor-pointer" />
              </div>
              <p className="mt-1">{comment.body}</p>
              <div className="mt-2 text-sm text-gray-500">
                <span className="cursor-pointer mr-4">Like</span>
                <span className="cursor-pointer">Reply</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  </div>
  );
};

export default CommentList;