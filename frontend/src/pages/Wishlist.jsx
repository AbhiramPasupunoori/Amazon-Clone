import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API from "../services/api";
import fallbackImage from "../assets/hero.png";

function Wishlist() {

    const [items, setItems] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [message, setMessage] =
        useState("");

    const loadWishlist = useCallback(async () => {

        setLoading(true);

        try {

            const res = await API.get("/wishlist");
            setItems(Array.isArray(res.data) ? res.data : []);

        } catch (error) {

            console.error(error);
            setMessage("Unable to load your wishlist.");

        } finally {

            setLoading(false);

        }

    }, []);

    useEffect(() => {

        loadWishlist();

    }, [loadWishlist]);

    const removeItem = async (id) => {

        try {

            await API.delete(`/wishlist/${id}`);
            setMessage("Item removed from wishlist.");
            loadWishlist();

        } catch (error) {

            console.error(error);
            setMessage("Unable to remove this item.");

        }

    };

    const moveToCart = async (id) => {

        try {

            const res = await API.post(`/wishlist/move-to-cart/${id}`);
            setMessage(res.data?.message || "Item moved to cart.");
            loadWishlist();

        } catch (error) {

            console.error(error);
            setMessage("Unable to move this item to cart.");

        }

    };

    return (

        <div className="page-wrap">

            <div className="page-heading split">
                <div>
                    <p className="eyebrow">Your lists</p>
                    <h1>Wishlist</h1>
                    <p>Save items for later and move them into your cart when you are ready.</p>
                </div>
                <Link className="text-link" to="/cart">View cart</Link>
            </div>

            {message && (
                <div className="notice compact">
                    {message}
                </div>
            )}

            {loading ? (
                <div className="loading-panel">Loading wishlist...</div>
            ) : items.length > 0 ? (
                <div className="wishlist-grid">
                    {items.map((item) => (
                        <article className="wishlist-item" key={item.id}>
                            <img
                                src={item.image || fallbackImage}
                                alt={item.name}
                                onError={(event) => {
                                    event.currentTarget.src = fallbackImage;
                                }}
                            />

                            <div>
                                <h2>{item.name}</h2>
                                <p className="product-price">
                                    <span>₹</span>
                                    {Number(item.price || 0).toLocaleString("en-IN")}
                                </p>
                                <p className="delivery-note">Saved for later</p>
                            </div>

                            <div className="stack-actions">
                                <button
                                    className="primary-button"
                                    type="button"
                                    onClick={() => moveToCart(item.id)}
                                >
                                    Move to Cart
                                </button>
                                <button
                                    className="secondary-button"
                                    type="button"
                                    onClick={() => removeItem(item.id)}
                                >
                                    Remove
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <h2>Your wishlist is empty</h2>
                    <p>Use the Add to Wishlist button on a product page to save items here.</p>
                    <Link className="primary-button" to="/">
                        Browse products
                    </Link>
                </div>
            )}

        </div>

    );

}

export default Wishlist;
