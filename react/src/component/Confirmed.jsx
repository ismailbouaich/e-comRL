import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Confirmed = () => {
  const [loading, setLoading] = useState(false);
  const [qrCodeBase64, setQrCodeBase64] = useState(null);
  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setLoading(true);
    // Get the current URL
    const url = window.location.href;

    // Create a URL object
    const urlObject = new URL(url);

    // Get the search parameters
    const searchParams = new URLSearchParams(urlObject.search);

    // Get the value of sessionId parameter
    const sessionId = searchParams.get('id');

    // Fetch QR code and order details
    axios.get(`/generateQrCode?id=${sessionId}`)
      .then((response) => {
        if (response.data) {
          const { qrCodeBase64, order } = response.data;
          setQrCodeBase64(qrCodeBase64);
          setOrder(order);
        }
        setMessage(response.data.message);
      })
      .catch((error) => {
        console.log('Error fetching order data:', error);
        setMessage('Error fetching order data');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {message && <p>{message}</p>}
      {order && (
        <div>
          <h1>Order Details</h1>
          <p>Order ID: {order.id}</p>
          {/* Display other relevant order details */}
        </div>
      )}

      {qrCodeBase64 && (
        <div>
          <img src={`data:image/svg+xml;base64, ${qrCodeBase64}`} alt="QR Code" />
        </div>
      )}
    </div>
  );
}

export default Confirmed;
