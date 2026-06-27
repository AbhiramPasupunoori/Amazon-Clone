import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import API from "../services/api";
import ProductCard from "../components/ProductCard";
import heroImage from "../assets/hero.png";
import { getDemoProducts } from "../data/demoProducts";

const categories = [
    "",
    "Mobiles",
    "Electronics",
    "Fashion",
    "Home",
    "Books"
];

const spotlightTiles = [
    {
        title: "Upgrade your phone",
        text: "Latest mobiles, chargers and accessories",
        category: "Mobiles"
    },
    {
        title: "Deals for home",
        text: "Kitchen, storage and everyday essentials",
        category: "Home"
    },
    {
        title: "Top picks in fashion",
        text: "Fresh styles with quick delivery",
        category: "Fashion"
    }
];

const heroPerks = [
    "Fast delivery",
    "Easy returns",
    "Secure checkout"
];

function Home() {

    const [products, setProducts] =
        useState([]);

    const [search, setSearch] =
        useState(() => new URLSearchParams(window.location.search).get("q") || "");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [activeCategory, setActiveCategory] =
        useState("");

    const [searchParams, setSearchParams] = useSearchParams();

    const loadProducts = useCallback(async ({ keyword = "", category = "" } = {}) => {

        setLoading(true);
        setError("");

        try {

            let endpoint = "/products";

            if (keyword.trim()) {
                endpoint = `/products/search?name=${encodeURIComponent(keyword.trim())}`;
            } else if (category) {
                endpoint = `/products/category/${encodeURIComponent(category)}`;
            }

            const res =
                await API.get(endpoint);

            setProducts(Array.isArray(res.data) ? res.data : []);

        } catch (err) {

            console.error(err);
            setProducts(getDemoProducts({
                keyword,
                category
            }));
            setError("Showing demo products because the store service is offline.");

        } finally {

            setLoading(false);

        }

    }, []);

    useEffect(() => {

        const keyword = searchParams.get("q") || "";

        loadProducts({
            keyword,
            category: keyword ? "" : activeCategory
        });

    }, [activeCategory, loadProducts, searchParams]);

    const searchProducts = (event) => {

        event.preventDefault();

        const keyword = search.trim();

        setActiveCategory("");
        setSearchParams(keyword ? {
            q: keyword
        } : {});

    };

    const filterCategory = (category) => {

        setActiveCategory(category);
        setSearch("");
        setSearchParams({});

    };

    const resetStore = () => {

        setSearch("");
        setActiveCategory("");
        setSearchParams({});

    };

    return (

        <div className="storefront">

            <section className="hero-band">

                <div className="hero-copy">
                    <p className="eyebrow">Great Indian shopping starts here</p>
                    <h1>Amazon Clone</h1>
                    <p>
                        Discover mobiles, home essentials, fashion picks and everyday deals
                        with a familiar marketplace experience.
                    </p>

                    <div className="hero-perks" aria-label="Store benefits">
                        {heroPerks.map((perk) => (
                            <span key={perk}>{perk}</span>
                        ))}
                    </div>

                    <form
                        className="hero-search"
                        onSubmit={searchProducts}
                    >
                        <input
                            type="search"
                            placeholder="Search for products, brands and more"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                        />

                        <button className="primary-button" type="submit">
                            Search
                        </button>
                    </form>
                </div>

                <div className="hero-visual">
                    <img
                        src={heroImage}
                        alt="Shopping boxes and products"
                    />
                </div>

            </section>

            <section className="deal-strip" aria-label="Store highlights">
                {spotlightTiles.map((tile) => (
                    <article className="mini-panel" key={tile.title}>
                        <h2>{tile.title}</h2>
                        <p>{tile.text}</p>
                        <button type="button" onClick={() => filterCategory(tile.category)}>
                            Shop now
                        </button>
                    </article>
                ))}
            </section>

            <section className="toolbar-section">

                <div>
                    <p className="eyebrow">Shop by department</p>
                    <h2>Featured products</h2>
                </div>

                <div className="category-tabs">
                    {categories.map((category) => (
                        <button
                            key={category || "all"}
                            className={activeCategory === category ? "active" : ""}
                            type="button"
                            onClick={() => filterCategory(category)}
                        >
                            {category || "All"}
                        </button>
                    ))}
                </div>

            </section>

            {error && (
                <div className="notice">
                    {error}
                    <button className="text-button inline-action" type="button" onClick={resetStore}>
                        Retry all products
                    </button>
                </div>
            )}

            {loading ? (
                <div className="product-grid">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div className="product-card skeleton-card" key={index}>
                            <div className="skeleton image" />
                            <div className="skeleton line" />
                            <div className="skeleton short-line" />
                            <div className="skeleton button" />
                        </div>
                    ))}
                </div>
            ) : products.length > 0 ? (
                <div className="product-grid">
                    {products.map(
                        (product) => (

                            <ProductCard
                                key={product.id}
                                product={product}
                            />

                        )
                    )}
                </div>
            ) : (
                <div className="empty-state">
                    <h2>No products found</h2>
                    <p>Try another search term or browse all departments.</p>
                    <button className="primary-button" type="button" onClick={resetStore}>
                        View all products
                    </button>
                </div>
            )}

        </div>

    );

}

export default Home;
