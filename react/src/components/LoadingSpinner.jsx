// components/LoadingSpinner.jsx
import React from 'react';
import { ClipLoader } from 'react-spinners';

const LoadingSpinner = ({ darkMode }) => (
  <div className="flex items-center justify-center min-h-screen">
    <ClipLoader size={50} color={darkMode ? '#fff' : '#000'} />
  </div>
);

export default LoadingSpinner;
