import React, { useState, useRef } from 'react';

const Model = ({ title, content, onClose,children }) => {

    const mapRef = useRef(null);

  return (
    <div className="fixed inset-0 bg-gray-500/50 flex justify-center items-center">
    <div className="flex bg-white p-4 rounded shadow-lg w-full">
      <h2 className="text-lg font-medium mb-2">{title}</h2>
      {/* Your model content */}
      {content && <p className="text-base">{content}</p>}
      
      {children}
      <button className="btn btn-primary" onClick={onClose}>
        Close
      </button>
    </div>
  </div>
  )
}

export default Model