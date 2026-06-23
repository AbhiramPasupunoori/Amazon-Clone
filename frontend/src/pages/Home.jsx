import { useEffect, useState } from "react";

import API from "../services/api";

import ProductCard from "../components/ProductCard";

function Home() {

    const [products, setProducts] =
        useState([]);

    useEffect(() => {

        fetchProducts();

    }, []);

    const fetchProducts = async () => {

        try {

            const res =
                await API.get(
                    "/products"
                );

            setProducts(
                res.data
            );

        } catch (err) {

            console.log(err);

        }

    };

    return (

        <div>

            <h1>
                Amazon Clone
            </h1>

            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap"
                }}
            >

                {products.map(
                    (product) => (

                        <ProductCard
                            key={product.id}
                            product={product}
                        />

                    )
                )}

            </div>

        </div>

    );

}

export default Home;