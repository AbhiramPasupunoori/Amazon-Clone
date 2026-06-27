import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API from "../services/api";

const formatDate = (value) => {
    if (!value) {
        return "Date unavailable";
    }

    return new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
};

const orderFlow = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered"
];

function Orders() {

    const [orders, setOrders] =
        useState([]);

    const [selectedOrder, setSelectedOrder] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [message, setMessage] =
        useState("");

    const loadOrderDetails = useCallback(async (orderId) => {

        try {

            const res = await API.get(`/orders/${orderId}`);
            setSelectedOrder(res.data);

        } catch (error) {

            console.error(error);
            setMessage("Unable to load order details.");

        }

    }, []);

    const loadOrders = useCallback(async () => {

        setLoading(true);

        try {

            const res = await API.get("/orders");
            const result = Array.isArray(res.data) ? res.data : [];

            setOrders(result);

            if (result.length > 0) {
                await loadOrderDetails(result[0].id);
            }

        } catch (error) {

            console.error(error);
            setMessage("Unable to load your orders.");

        } finally {

            setLoading(false);

        }

    }, [loadOrderDetails]);

    useEffect(() => {

        loadOrders();

    }, [loadOrders]);

    const cancelOrder = async (orderId) => {

        try {

            const res = await API.put(`/orders/cancel/${orderId}`);
            setMessage(res.data?.message || "Order updated.");
            await loadOrders();

        } catch (error) {

            console.error(error);
            setMessage("Unable to cancel this order.");

        }

    };

    return (

        <div className="page-wrap">

            <div className="page-heading split">
                <div>
                    <p className="eyebrow">Your account</p>
                    <h1>Your Orders</h1>
                    <p>Track, review and manage recent Amazon Clone purchases.</p>
                </div>
                <Link className="text-link" to="/">
                    Buy again
                </Link>
            </div>

            {message && (
                <div className="notice compact">
                    {message}
                </div>
            )}

            {loading ? (
                <div className="loading-panel">Loading orders...</div>
            ) : orders.length > 0 ? (
                <div className="orders-layout">

                    <section className="orders-list" aria-label="Order list">
                        {orders.map((order) => (
                            <button
                                className={`order-row ${selectedOrder?.order?.id === order.id ? "active" : ""}`}
                                type="button"
                                key={order.id}
                                onClick={() => loadOrderDetails(order.id)}
                            >
                                <span>
                                    <strong>Order #{order.id}</strong>
                                    {formatDate(order.created_at)}
                                </span>
                                <span className={`status-pill ${String(order.status || "").toLowerCase()}`}>
                                    {order.status || "Pending"}
                                </span>
                                <strong>
                                    ₹{Number(order.total_amount || 0).toLocaleString("en-IN")}
                                </strong>
                            </button>
                        ))}
                    </section>

                    <section className="order-detail-panel">
                        {selectedOrder ? (
                            <>
                                <div className="page-heading split compact-heading">
                                    <div>
                                        <p className="eyebrow">Order details</p>
                                        <h2>Order #{selectedOrder.order.id}</h2>
                                    </div>
                                    <span className={`status-pill ${String(selectedOrder.order.status || "").toLowerCase()}`}>
                                        {selectedOrder.order.status}
                                    </span>
                                </div>

                                <div className="summary-line">
                                    <span>Placed on</span>
                                    <strong>{formatDate(selectedOrder.order.created_at)}</strong>
                                </div>

                                <div className="summary-line total">
                                    <span>Total</span>
                                    <strong>
                                        ₹{Number(selectedOrder.order.total_amount || 0).toLocaleString("en-IN")}
                                    </strong>
                                </div>

                                <div className="order-timeline" aria-label="Order progress">
                                    {orderFlow.map((status) => {
                                        const currentIndex = orderFlow.indexOf(selectedOrder.order.status);
                                        const statusIndex = orderFlow.indexOf(status);

                                        return (
                                            <span
                                                className={statusIndex <= currentIndex ? "active" : ""}
                                                key={status}
                                            >
                                                {status}
                                            </span>
                                        );
                                    })}
                                </div>

                                <div className="review-list">
                                    {selectedOrder.items.map((item) => (
                                        <div className="review-item" key={item.product_id}>
                                            <span>{item.name}</span>
                                            <strong>
                                                {item.quantity} x ₹{Number(item.price || 0).toLocaleString("en-IN")}
                                            </strong>
                                        </div>
                                    ))}
                                </div>

                                {selectedOrder.order.status === "Pending" && (
                                    <button
                                        className="secondary-button"
                                        type="button"
                                        onClick={() => cancelOrder(selectedOrder.order.id)}
                                    >
                                        Cancel order
                                    </button>
                                )}
                            </>
                        ) : (
                            <div className="empty-state slim">
                                <h2>Select an order</h2>
                                <p>Choose an order to view item details.</p>
                            </div>
                        )}
                    </section>

                </div>
            ) : (
                <div className="empty-state">
                    <h2>No orders yet</h2>
                    <p>When you place an order, it will appear here.</p>
                    <Link className="primary-button" to="/">
                        Start shopping
                    </Link>
                </div>
            )}

        </div>

    );

}

export default Orders;
