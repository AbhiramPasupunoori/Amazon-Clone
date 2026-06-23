import { useEffect, useState } from "react";

import API from "../services/api";
import ProductCard from "../components/ProductCard";

function Home() {

    const [products, setProducts] =
        useState([]);

    const [search, setSearch] =
        useState("");

    useEffect(() => {

        getProducts();

    }, []);

    const getProducts = async () => {

        try {

            const res =
                await API.get("/products");

            setProducts(res.data);

        } catch (error) {

            console.error(error);

        }

    };

    const searchProducts = async () => {

        try {

            if (!search.trim()) {

                getProducts();
                return;

            }

            const res =
                await API.get(
                    `/products/search?name=${search}`
                );

            setProducts(res.data);

        } catch (error) {

            console.error(error);

        }

    };

    const filterCategory = async (category) => {

        try {

            if (!category) {

                getProducts();
                return;

            }

            const res =
                await API.get(
                    `/products/category/${category}`
                );

            setProducts(res.data);

        } catch (error) {

            console.error(error);

        }

    };

    return (

        <div
            style={{
                padding: "20px"
            }}
        >

            <h1>
                Amazon Clone
            </h1>

            <div
                style={{
                    marginBottom: "20px",
                    display: "flex",
                    gap: "10px"
                }}
            >

                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                    style={{
                        padding: "10px",
                        width: "300px"
                    }}
                />

                <button
                    onClick={searchProducts}
                >
                    Search
                </button>

                <select
                    onChange={(e) =>
                        filterCategory(
                            e.target.value
                        )
                    }
                >

                    <option value="">
                        All Categories
                    </option>

                    <option value="Mobiles">
                        Mobiles
                    </option>

                </select>

            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fill,minmax(250px,1fr))",
                    gap: "20px"
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