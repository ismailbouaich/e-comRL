import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

import { CiImport } from "react-icons/ci";
import { Button } from '../components/ui/button';


const Confirmed = () => {
  const [loading, setLoading] = useState(false);
  const [qrCodeBase64, setQrCodeBase64] = useState(null);
  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setLoading(true);
    const url = window.location.href;
    const urlObject = new URL(url);
    const searchParams = new URLSearchParams(urlObject.search);
    const sessionId = searchParams.get('id');

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

  const downloadQrCode = () => {
    const link = document.createElement('a');
    link.href = `data:image/svg+xml;base64,${qrCodeBase64}`;
    link.download = 'qr-code.svg'; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); 
  };

  if (loading) {
    return <div className='p-20'><LoadingSpinner /></div>;
  }

  if (!order) {
    return <div className='p-20'>No order found.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  p-6">
      <div className="bg-gray-100 rounded-lg shadow-lg p-10 max-w-md text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Order Confirmed</h1>

        <p className="text-gray-600 mb-4">
          Thank you for your purchase from our store! Your order will be in your hands as soon as possible.
        </p>
        <p className="text-gray-600 mb-6">
          Please check your email. You'll receive a QR code to give to the delivery worker. Thank you!
        </p>

        {order && (
          <div className="text-left mb-4">
          
            <p className="text-gray-600">Order: {order.id}</p>
          </div>
        )}

        {qrCodeBase64 && (
          <div className="relative flex flex-col justify-center items-center mb-6">
            <img src={`data:image/svg+xml;base64,${qrCodeBase64}`} alt="QR Code" className="w-40 h-40 relative z-10 hover:opacity-75 transition-opacity duration-300" />
            <Button 
              onClick={downloadQrCode} 
              className="absolute z-20  text-white font-bold py-2 px-4 rounded opacity-0 hover:opacity-100 transition-opacity duration-300">
              <CiImport/>
            </Button>
          </div>
        )}

        {message && (
          <p className="text-green-500 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
}

export default Confirmed;
