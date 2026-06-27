import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API from "../services/api";
import fallbackImage from "../assets/hero.png";

function Cart() {

    const [cart, setCart] =
        useState({
            items: [],
            totalItems: 0,
            subtotal: 0
        });

    const [loading, setLoading] =
        useState(true);

    const [message, setMessage] =
        useState("");

    const getCart = useCallback(async () => {

        setLoading(true);

        try {

            const res =
                await API.get("/cart");

            setCart({
                items: res.data?.items || [],
                totalItems: res.data?.totalItems || 0,
                subtotal: Number(res.data?.subtotal || 0)
            });

        } catch (error) {

            console.error(error);
            setMessage("Unable to load your cart.");

        } finally {

            setLoading(false);

        }

    }, []);

    useEffect(() => {

        getCart();

    }, [getCart]);

    const removeItem =
        async (cartId) => {

            try {

                await API.delete(
                    `/cart/${cartId}`
                );

                setMessage("Item removed");
                getCart();

            } catch (error) {

                console.error(error);
                setMessage("Unable to remove item.");

            }

        };

    const updateQuantity =
        async (cartId, quantity) => {

            try {

                if (quantity < 1) {
                    await removeItem(cartId);
                    return;
                }

                await API.put(
                    "/cart/update",
                    {
                        cart_id: cartId,
                        quantity
                    }
                );

                setMessage("Cart updated");
                getCart();

            } catch (error) {

                console.error(error);
                setMessage("Unable to update quantity.");

            }

        };

    const subtotal = Number(cart.subtotal || 0);
    const taxEstimate = Math.round(subtotal * 0.05);
    const grandTotal = subtotal + taxEstimate;

    return (

        <div className="page-wrap">

            <div className="cart-layout">

                <section className="cart-items-panel">

                    <div className="page-heading split">
                        <div>
                            <p className="eyebrow">Shopping Cart</p>
                            <h1>Your Amazon Clone Cart</h1>
                            {cart.items.length > 0 && (
                                <p>
                                    Subtotal ({cart.totalItems} items): ₹{subtotal.toLocaleString("en-IN")}
                                </p>
                            )}
                        </div>
                        <Link to="/" className="text-link">Continue shopping</Link>
                    </div>

                    {message && (
                        <div className="notice compact">
                            {message}
                        </div>
                    )}

                    {loading ? (
                        <div className="loading-panel">Loading cart...</div>
                    ) : cart.items.length > 0 ? (
                        <div className="cart-list">
                            {cart.items.map(item => {
                                const price = Number(item.price || 0).toLocaleString("en-IN");

                                return (
                                    <article className="cart-item" key={item.id}>
                                        <img
                                            src={item.image || fallbackImage}
                                            alt={item.name}
                                            onError={(event) => {
                                                event.currentTarget.src = fallbackImage;
                                            }}
                                        />

                                        <div className="cart-item-info">
                                            <h2>{item.name}</h2>
                                            <p className="stock in-stock">In stock</p>
                                            <p className="delivery-note">Eligible for FREE delivery</p>
                                            <label className="gift-row">
                                                <input type="checkbox" />
                                                This item is a gift
                                            </label>

                                            <div className="quantity-control">
                                                <button
                                                    type="button"
                                                    aria-label="Decrease quantity"
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.id,
                                                            item.quantity - 1
                                                        )
                                                    }
                                                >
                                                    -
                                                </button>

                                                <span>{item.quantity}</span>

                                                <button
                                                    type="button"
                                                    aria-label="Increase quantity"
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.id,
                                                            item.quantity + 1
                                                        )
                                                    }
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                className="text-button"
                                                type="button"
                                                onClick={() =>
                                                    removeItem(
                                                        item.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>
                                        </div>

                                        <p className="cart-price">
                                            ₹{price}
                                        </p>
                                    </article>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <h2>Your cart is empty</h2>
                            <p>Add a few products and they will show up here.</p>
                            <Link className="primary-button" to="/">
                                Shop today&apos;s deals
                            </Link>
                        </div>
                    )}

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

                    <Link
                        className={`primary-button full-width ${cart.items.length === 0 ? "disabled-link" : ""}`}
                        to={cart.items.length === 0 ? "/cart" : "/checkout"}
                    >
                        Proceed to Buy
                    </Link>

                    <p className="secure-note">
                        Your order is protected by secure checkout.
                    </p>
                </aside>

            </div>

        </div>

    );


}

export default Cart;
