import  { useState, useEffect } from 'react';
import axios from 'axios';

const Success = () => {
    const [loading, setLoading] = useState(false);
    const [qrCodeBase64, setQrCodeBase64] = useState(null);
    const [order, setOrder] = useState(null);
    const [message, setMessage] = useState('');

  
    useEffect(() => {
      setLoading(true);
    //   const urlParams = new URLSearchParams(window.location.href);
    //   alert("here 2"+window.location)
    //   console.log("success url",window.location.search);
    const url = window.location.href;
    
    // Create a URL object
    const urlObject = new URL(url);
    
    // Get the first parameter
    const session_id = urlObject.pathname.split('/')[2];
    
    alert("here 2"+session_id)
      axios.get(`/success/${session_id}`)
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

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            sss
            
            {qrCodeBase64 && (
                <div>
                    <img src={`data:image/svg+xml;base64, ${qrCodeBase64}`} alt="QR Code" />
                </div>
            )}
        </div>
    );
}

export default Success;
