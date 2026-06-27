import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import API from "../services/api";

import { demoProducts } from "../data/demoProducts";

function ProductDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [busy, setBusy] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const getProduct = useCallback(async () => {

        try {

            setError("");

            const res =
                await API.get(
                    `/products/${id}`
                );

            setProduct(res.data);

        } catch (err) {

            console.error(err);
            const demoProduct = demoProducts.find((item) => String(item.id) === String(id));

            if (demoProduct) {
                setProduct(demoProduct);
                setMessage("Showing a demo product because the store service is offline.");
                return;
            }

            setError("Failed to load product");

        }

    }, [id]);

    useEffect(() => {

        getProduct();

    }, [getProduct]);

    const addToCart = async () => {

        setBusy(true);
        setMessage("");

        try {
            if (product.demo) {
                setMessage("Demo item. Start the backend to add it to your cart.");
                return false;
            }

            const res = await API.post(
                "/cart/add",
                {
                    product_id: product.id,
                    quantity
                }
            );

            setMessage(res.data?.message || "Product added to cart");
            return true;

        } catch (error) {

            console.error(error);
            setMessage("Please login first to add this item to your cart.");
            return false;

        } finally {

            setBusy(false);

        }

    };

    const addToWishlist = async () => {

        setBusy(true);
        setMessage("");

        try {
            if (product.demo) {
                setMessage("Demo item. Start the backend to save it to your wishlist.");
                return;
            }

            const res = await API.post(
                "/wishlist/add",
                {
                    product_id: product.id
                }
            );

            setMessage(res.data?.message || "Product added to wishlist");

        } catch (error) {

            console.error(error);
            setMessage("Please login first to save this item.");

        } finally {

            setBusy(false);

        }

    };

    const buyNow = async () => {
        const added = await addToCart();

        if (added) {
            navigate("/checkout");
        }
    };

    if (error) {

        return (
            <div className="page-wrap">
                <div className="notice error">
                    {error}
                </div>
            </div>
        );

    }

    if (!product) {

        return (
            <div className="page-wrap">
                <div className="loading-panel">
                    Loading product...
                </div>
            </div>
        );

    }

    const price = Number(product.price || 0).toLocaleString("en-IN");
    const stock = Number(product.stock || 0);
    const safeQuantity = Math.min(quantity, Math.max(stock, 1));

    return (

        <div className="page-wrap">

            <div className="breadcrumbs">
                <Link to="/">Home</Link>
                <span>/</span>
                <span>{product.category || "Products"}</span>
            </div>

            <section className="product-detail">

                <div className="detail-image">
                    <img
                        src={product.image}
                        alt={product.name}
                        onError={(event) => {
                            event.currentTarget.style.display = "none";
                        }}
                    />
                </div>

                <div className="detail-info">

                    <p className="product-brand">
                        {product.brand || "Amazon Clone"}
                    </p>

                    <h1>
                        {product.name}
                    </h1>

                    <div className="rating-row large">
                        <span>★★★★★</span>
                        <small>4.4 ratings</small>
                    </div>

                    <div className="detail-price">
                        <span>₹</span>
                        {price}
                    </div>

                    <p className={stock > 0 ? "stock in-stock" : "stock out-stock"}>
                        {stock > 0 ? `In stock: ${stock} available` : "Currently unavailable"}
                    </p>

                    <p className="detail-description">
                        {product.description || "A quality product from Amazon Clone."}
                    </p>

                    <div className="service-strip" aria-label="Purchase benefits">
                        <span>Free delivery</span>
                        <span>7 day replacement</span>
                        <span>Secure transaction</span>
                    </div>

                    <dl className="spec-list">
                        <div>
                            <dt>Category</dt>
                            <dd>{product.category || "General"}</dd>
                        </div>
                        <div>
                            <dt>Brand</dt>
                            <dd>{product.brand || "Amazon Basics"}</dd>
                        </div>
                        <div>
                            <dt>Delivery</dt>
                            <dd>Free delivery on eligible orders</dd>
                        </div>
                    </dl>

                </div>

                <aside className="buy-box">
                    <p className="detail-price compact">
                        <span>₹</span>
                        {price}
                    </p>
                    <p className="delivery-note">FREE delivery tomorrow</p>
                    <p className={stock > 0 ? "stock in-stock" : "stock out-stock"}>
                        {stock > 0 ? "Available now" : "Out of stock"}
                    </p>

                    <label className="quantity-select">
                        Quantity
                        <select
                            value={safeQuantity}
                            onChange={(event) => setQuantity(Number(event.target.value))}
                            disabled={stock < 1}
                        >
                            {Array.from({
                                length: Math.min(stock || 1, 10)
                            }).map((_, index) => (
                                <option key={index + 1} value={index + 1}>
                                    {index + 1}
                                </option>
                            ))}
                        </select>
                    </label>

                    {message && (
                        <div className="notice compact">
                            {message}
                        </div>
                    )}

                    <button
                        className="primary-button full-width"
                        type="button"
                        onClick={addToCart}
                        disabled={busy || stock < 1}
                    >
                        Add to Cart
                    </button>

                    <button
                        className="buy-button full-width"
                        type="button"
                        onClick={buyNow}
                        disabled={busy || stock < 1}
                    >
                        Buy Now
                    </button>

                    <button
                        className="secondary-button full-width"
                        type="button"
                        onClick={addToWishlist}
                        disabled={busy}
                    >
                        Add to Wishlist
                    </button>

                    <p className="secure-note">Secure transaction</p>

                    <div className="buy-box-meta">
                        <span>Ships from</span>
                        <strong>Amazon Clone</strong>
                        <span>Sold by</span>
                        <strong>{product.brand || "Amazon Basics"}</strong>
                    </div>
                </aside>

            </section>

        </div>

    );

}

export default ProductDetails;
