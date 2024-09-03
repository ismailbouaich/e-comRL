import { useSelector } from "react-redux";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/table"
import { Button } from "../../components/ui/button";
import { ScrollArea } from "../../components/ui/scroll-area";
import { useState } from "react";
import OrderDetails from "./OrderDetail";

const OrderList = () => {
    const orders = useSelector((state) => state.order.orders);
    const loading = useSelector((state) => state.order.loading);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleViewClick = (order) => {
        setSelectedOrder(order);
    };

    const handleBackClick = () => {
        setSelectedOrder(null);
    };

    if (selectedOrder) {
        return <OrderDetails order={selectedOrder} onBack={handleBackClick} />;
    }

    if (loading) {
        return <div>Loading orders...</div>;
    }

    if (!orders.length) {
        return <div>No orders found.</div>;
    }

    return (
        <Table className="w-[750px]">
            <ScrollArea className="h-full">
                <TableCaption>A list of your Orders.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">#</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="">Total</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.order_id}>
                            <TableCell className="font-medium">{order.order_id}</TableCell>
                            <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
                            <TableCell>{order.status}</TableCell>
                            <TableCell className="">${order.total.toFixed(2)} for {order.products.length} items</TableCell>
                            <TableCell>
                                <Button onClick={() => handleViewClick(order)}>
                                    View
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </ScrollArea>
        </Table>
    );
};

export default OrderList;