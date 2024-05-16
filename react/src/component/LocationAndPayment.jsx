import React, { useState } from 'react';
import BingMap from './BingMap';

const LocationAndPaymentModal = ({ onClose, onSubmit }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [paymentFormData, setPaymentFormData] = useState({
    // Define fields for payment form data
  });

  const handleLocationSelect = (address, zipCode, city) => {
    setSelectedLocation({ address, zipCode, city });
  };

  const handlePaymentFormChange = (e) => {
    // Update payment form data
    const { name, value } = e.target;
    setPaymentFormData({ ...paymentFormData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(selectedLocation, paymentFormData);
    onClose(); // Close the modal after submission
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <BingMap onLocationSelect={handleLocationSelect} />
        <form onSubmit={handleFormSubmit}>
          {/* Payment form fields */}
          <input type="text" name="paymentField1" onChange={handlePaymentFormChange} />
          <input type="text" name="paymentField2" onChange={handlePaymentFormChange} />
          {/* Add more payment form fields as needed */}
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default LocationAndPaymentModal;
