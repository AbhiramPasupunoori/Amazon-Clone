import { Link } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";


function ProductCard({ product }) {

    const [message, setMessage] = useState("");
    const [busy, setBusy] = useState(false);

    const productId = product.id ?? product.product_id;
    const price = Number(product.price || 0).toLocaleString("en-IN");
    const stock = Number(product.stock || 0);
    const reviewCount = 120 + String(productId || product.name).length * 17;

    const addToCart = async () => {
        setMessage("");

        if (product.demo) {
            setMessage("Demo item. Start the backend to add it to your cart.");
            return;
        }

        setBusy(true);

        try {
            const res = await API.post("/cart/add", {
                product_id: productId,
                quantity: 1
            });

            setMessage(res.data?.message || "Added to cart");
        } catch (error) {
            console.error(error);
            setMessage("Sign in to add this item.");
        } finally {
            setBusy(false);
        }
    };

    return (

        <article className="product-card">

            <Link
                className="product-image-link"
                to={`/products/${productId}`}
            >
                <img
                    src={product.image}
                    alt={product.name}
                    onError={(event) => {
                        event.currentTarget.style.display = "none";
                    }}
                />
            </Link>

            <div className="product-card-body">

                <p className="product-brand">
                    {product.brand || product.category || "Amazon Basics"}
                </p>

                <Link
                    className="product-title"
                    to={`/products/${productId}`}
                >
                    {product.name}
                </Link>

                <div className="rating-row" aria-label="4.4 out of 5 stars">
                    <span>★★★★★</span>
                    <small>4.4 ({reviewCount})</small>
                </div>

                <p className="product-price">
                    <span>₹</span>
                    {price}
                </p>

                <p className="product-shipping">FREE delivery on eligible orders</p>

                <p className={stock > 0 ? "stock in-stock" : "stock out-stock"}>
                    {stock > 0 ? `${stock} in stock` : "Currently unavailable"}
                </p>

                {message && (
                    <p className="card-feedback">
                        {message}
                    </p>
                )}

                <div className="product-card-actions">
                    <button
                        className="primary-button"
                        type="button"
                        onClick={addToCart}
                        disabled={busy || stock < 1}
                    >
                        {busy ? "Adding..." : "Add to Cart"}
                    </button>

                    <Link
                        className="secondary-button"
                        to={`/products/${productId}`}
                    >
                        Details
                    </Link>
                </div>

            </div>

        </article>

    );

}

export default ProductCard;
