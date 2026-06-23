import { Link } from "react-router-dom";

function ProductCard({ product }) {

    return (

        <div
            style={{
                border: "1px solid #ddd",
                padding: "15px",
                borderRadius: "10px"
            }}
        >

            <img
                src={product.image}
                alt={product.name}
                width="200"
                style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "contain"
                }}
            />

            <h3>{product.name}</h3>

            <p>₹{product.price}</p>

            <p>{product.brand}</p>

            <Link
                to={`/products/${product.id}`}
            >
                View Details
            </Link>

        </div>

    );

}

export default ProductCard;