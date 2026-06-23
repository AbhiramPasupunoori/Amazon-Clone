import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import API from "../services/api";

function ProductDetails() {

    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {

        getProduct();

    }, [id]);

    const getProduct = async () => {

        try {

            const res =
                await API.get(
                    `/products/${id}`
                );

            setProduct(res.data);

        } catch (err) {

            console.error(err);

            setError(
                "Failed to load product"
            );

        }

    };

    const addToCart = async () => {

        try {

            await API.post(
                "/cart/add",
                {
                    product_id: product.id,
                    quantity: 1
                }
            );

            alert(
                "Product added to cart"
            );

        } catch (error) {

            console.error(error);

            alert(
                "Please login first"
            );

        }

    };

    const addToWishlist = async () => {

        try {

            await API.post(
                "/wishlist/add",
                {
                    product_id: product.id
                }
            );

            alert(
                "Product added to wishlist"
            );

        } catch (error) {

            console.error(error);

            alert(
                "Please login first"
            );

        }

    };

    if (error) {

        return (
            <h2>{error}</h2>
        );

    }

    if (!product) {

        return (
            <h2>Loading...</h2>
        );

    }

    return (

        <div
            style={{
                padding: "30px",
                maxWidth: "900px",
                margin: "0 auto"
            }}
        >

            <h1>
                {product.name}
            </h1>

            <img
                src={product.image}
                alt={product.name}
                width="300"
                style={{
                    objectFit: "contain"
                }}
            />

            <p>
                {product.description}
            </p>

            <h2>
                ₹{product.price}
            </h2>

            <p>
                <strong>
                    Category:
                </strong>{" "}
                {product.category}
            </p>

            <p>
                <strong>
                    Brand:
                </strong>{" "}
                {product.brand}
            </p>

            <p>
                <strong>
                    Stock:
                </strong>{" "}
                {product.stock}
            </p>

            <div
                style={{
                    marginTop: "20px"
                }}
            >

                <button
                    onClick={addToCart}
                    style={{
                        marginRight: "10px",
                        padding:
                            "10px 20px"
                    }}
                >
                    Add To Cart
                </button>

                <button
                    onClick={
                        addToWishlist
                    }
                    style={{
                        padding:
                            "10px 20px"
                    }}
                >
                    Add To Wishlist
                </button>

            </div>

        </div>

    );

}

export default ProductDetails;