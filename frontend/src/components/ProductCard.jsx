import { Link } from "react-router-dom";

function ProductCard({ product }) {

    return (

        <div
            style={{
                border: "1px solid #ddd",
                padding: "15px",
                margin: "10px",
                width: "250px"
            }}
        >

            <img
                src={`http://localhost:3000/images/${product.image}`}
                alt={product.name}
                width="200"
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