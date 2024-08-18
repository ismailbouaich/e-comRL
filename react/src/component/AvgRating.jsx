import React from 'react';

const AvgRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    } else {
      stars.push(<span key={i} className="text-gray-300">★</span>);
    }
  }
  
  return <div className="flex">{stars}</div>;
};

export default AvgRating;