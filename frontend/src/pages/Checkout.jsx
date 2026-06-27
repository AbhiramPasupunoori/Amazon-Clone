import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API from "../services/api";

function Checkout() {

    const [cart, setCart] =
        useState({
            items: [],
            totalItems: 0,
            subtotal: 0
        });

    const [address, setAddress] =
        useState({
            name: "",
            phone: "",
            line1: "",
            city: "",
            pincode: ""
        });

    const [paymentMethod, setPaymentMethod] =
        useState("COD");

    const [loading, setLoading] =
        useState(true);

    const [placing, setPlacing] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const navigate = useNavigate();

    const loadCart = useCallback(async () => {

        setLoading(true);

        try {

            const res = await API.get("/cart");

            setCart({
                items: res.data?.items || [],
                totalItems: res.data?.totalItems || 0,
                subtotal: Number(res.data?.subtotal || 0)
            });

        } catch (error) {

            console.error(error);
            setMessage("Unable to load checkout details.");

        } finally {

            setLoading(false);

        }

    }, []);

    useEffect(() => {

        loadCart();

    }, [loadCart]);

    const updateAddress = (field, value) => {
        setAddress({
            ...address,
            [field]: value
        });
    };

    const placeOrder = async (event) => {

        event.preventDefault();
        setPlacing(true);
        setMessage("");

        try {

            const orderRes = await API.post("/orders/place");
            const orderId = orderRes.data?.order_id;

            if (!orderId) {
                setMessage(orderRes.data?.message || "Unable to place order.");
                return;
            }

            if (paymentMethod === "COD") {
                await API.post("/payments/cod", {
                    order_id: orderId
                });
            }

            navigate("/orders");

        } catch (error) {

            console.error(error);
            setMessage("Order could not be placed. Please try again.");

        } finally {

            setPlacing(false);

        }

    };

    const subtotal = Number(cart.subtotal || 0);
    const taxEstimate = Math.round(subtotal * 0.05);
    const grandTotal = subtotal + taxEstimate;

    if (loading) {
        return (
            <div className="page-wrap">
                <div className="loading-panel">Preparing checkout...</div>
            </div>
        );
    }

    return (

        <div className="page-wrap">

            <div className="page-heading">
                <p className="eyebrow">Secure checkout</p>
                <h1>Checkout</h1>
            </div>

            {cart.items.length === 0 ? (
                <div className="empty-state">
                    <h2>Your cart is empty</h2>
                    <p>Add items before starting checkout.</p>
                    <Link className="primary-button" to="/">
                        Continue shopping
                    </Link>
                </div>
            ) : (
                <form className="checkout-layout" onSubmit={placeOrder}>

                    <section className="checkout-steps">

                        <div className="checkout-progress" aria-label="Checkout steps">
                            <span className="active">Address</span>
                            <span className="active">Payment</span>
                            <span className="active">Review</span>
                        </div>

                        {message && (
                            <div className="notice error compact">
                                {message}
                            </div>
                        )}

                        <div className="checkout-section">
                            <h2>1. Delivery address</h2>

                            <div className="form-grid">
                                <label>
                                    Full name
                                    <input
                                        value={address.name}
                                        onChange={(event) =>
                                            updateAddress("name", event.target.value)
                                        }
                                        required
                                    />
                                </label>

                                <label>
                                    Phone number
                                    <input
                                        value={address.phone}
                                        onChange={(event) =>
                                            updateAddress("phone", event.target.value)
                                        }
                                        required
                                    />
                                </label>

                                <label className="span-two">
                                    Address
                                    <textarea
                                        value={address.line1}
                                        onChange={(event) =>
                                            updateAddress("line1", event.target.value)
                                        }
                                        required
                                    />
                                </label>

                                <label>
                                    City
                                    <input
                                        value={address.city}
                                        onChange={(event) =>
                                            updateAddress("city", event.target.value)
                                        }
                                        required
                                    />
                                </label>

                                <label>
                                    PIN code
                                    <input
                                        value={address.pincode}
                                        onChange={(event) =>
                                            updateAddress("pincode", event.target.value)
                                        }
                                        required
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="checkout-section">
                            <h2>2. Payment method</h2>

                            <label className="radio-row">
                                <input
                                    type="radio"
                                    name="payment"
                                    checked={paymentMethod === "COD"}
                                    onChange={() => setPaymentMethod("COD")}
                                />
                                <span>
                                    <strong>Cash on Delivery</strong>
                                    Pay when your package arrives.
                                </span>
                            </label>

                            <label className="radio-row muted-row">
                                <input
                                    type="radio"
                                    name="payment"
                                    disabled
                                />
                                <span>
                                    <strong>Card / UPI</strong>
                                    Online payments can be enabled from the payments service.
                                </span>
                            </label>
                        </div>

                        <div className="checkout-section">
                            <h2>3. Review items</h2>

                            <div className="review-list">
                                {cart.items.map((item) => (
                                    <div className="review-item" key={item.id}>
                                        <span>{item.name}</span>
                                        <strong>
                                            {item.quantity} x ₹{Number(item.price || 0).toLocaleString("en-IN")}
                                        </strong>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </section>

                    <aside className="summary-card">
                        <h2>Order Summary</h2>

                        <div className="summary-line">
                            <span>Items</span>
                            <strong>{cart.totalItems}</strong>
                        </div>

                        <div className="summary-line">
                            <span>Subtotal</span>
                            <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
                        </div>

                        <div className="summary-line">
                            <span>Estimated tax</span>
                            <strong>₹{taxEstimate.toLocaleString("en-IN")}</strong>
                        </div>

                        <div className="summary-line total">
                            <span>Order total</span>
                            <strong>₹{grandTotal.toLocaleString("en-IN")}</strong>
                        </div>

                        <button
                            className="primary-button full-width"
                            type="submit"
                            disabled={placing}
                        >
                            {placing ? "Placing order..." : "Place your order"}
                        </button>

                        <p className="secure-note">
                            By placing your order, you agree to Amazon Clone&apos;s policies. A confirmation appears in Your Orders.
                        </p>
                    </aside>

                </form>
            )}

        </div>

    );

}

export default Checkout;
