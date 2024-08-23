import React from 'react';

const OrderDetails = ({ order, onBack }) => {
    return (
        <div>
            <button onClick={onBack}>Back to Order History</button>
            <h2>Order #{order.order_id}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {order.products.map((product, index) => (
                        <tr key={index}>
                            <td>{product.name}</td>
                            <td>{product.quantity}</td>
                            <td>${parseFloat(product.total).toFixed(2)}</td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan="2">Subtotal:</td>
                        <td>${parseFloat(order.subtotal).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colSpan="2">Shipping:</td>
                        <td>${parseFloat(order.shipping).toFixed(2)} via Flat rate</td>
                    </tr>
                    <tr>
                        <td colSpan="2">Total:</td>
                        <td>${parseFloat(order.total).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colSpan="2">Note:</td>
                        <td>{order.note}</td>
                    </tr>
                </tbody>
            </table>
            <h3>Shipping Address:</h3>
            <p>{order.shipping_address.address}, {order.shipping_address.city}, {order.shipping_address.zip_code}</p>
        </div>
    );
};

export default OrderDetails;