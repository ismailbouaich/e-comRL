<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Order Passed Successfully</title>
    <style>
        /* Inline styles for simplicity, consider using CSS classes for larger templates */
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f1f1f1;
        }

        .logo {
            text-align: center;
            margin-bottom: 20px;
        }

        .logo img {
            max-width: 200px;
        }

        .message {
            padding: 20px;
            background-color: #ffffff;
        }

        .message p {
            margin-bottom: 10px;
        }

        .footer {
            text-align: center;
            margin-top: 20px;
        }
    </style>
</head>

<body>
    <div class="container">
        
        <div class="message">
            <p>Dear {{ $mailData['name'] }},</p>
            <p>Thank you for Chosing Our Store we Hope Our Team have been on your Thoughts.</p>

            <p>Your order has been placed successfully.</p>
            <p>Here is your QR Code:</p>
            <img src="data:image/svg+xml;base64,{{ $mailData['qrCode'] }}" alt="QR Code">
        </div>
        
    </div>
</body>

</html>