import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import { AuthContext } from "../context/auth-context";
import API from "../services/api";

function Navbar() {

    const { user, logout } =
        useContext(AuthContext);

    const navigate = useNavigate();
    const [query, setQuery] = useState(() =>
        new URLSearchParams(window.location.search).get("q") || ""
    );
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        if (!user) {
            return undefined;
        }

        let ignore = false;

        API.get("/cart")
            .then((res) => {
                if (!ignore) {
                    setCartCount(Number(res.data?.totalItems || 0));
                }
            })
            .catch(() => {
                if (!ignore) {
                    setCartCount(0);
                }
            });

        return () => {
            ignore = true;
        };
    }, [user]);

    const handleSearch = (event) => {
        event.preventDefault();

        const term = query.trim();

        navigate(term ? `/?q=${encodeURIComponent(term)}` : "/");
    };

    const handleLogout = () => {
        logout();
        setCartCount(0);
        navigate("/");
    };

    return (

        <header className="site-header">

            <div className="top-nav">

                <Link
                    className="brand"
                    to="/"
                    aria-label="Amazon Clone home"
                >
                    <span>amazon</span>
                    <small>.clone</small>
                </Link>

                <button className="delivery-pill" type="button">
                    <span>Deliver to</span>
                    <strong>India</strong>
                </button>

                <form
                    className="search-bar"
                    onSubmit={handleSearch}
                >
                    <select aria-label="Search department">
                        <option>All</option>
                        <option>Mobiles</option>
                        <option>Electronics</option>
                        <option>Fashion</option>
                        <option>Home</option>
                        <option>Books</option>
                    </select>

                    <input
                        type="search"
                        placeholder="Search Amazon Clone"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                    />

                    <button type="submit" aria-label="Search">
                        Search
                    </button>
                </form>

                <div className="account-actions">

                    {user ? (
                        <button
                            className="nav-account"
                            type="button"
                            onClick={handleLogout}
                        >
                            <span>Hello, {user.name || "shopper"}</span>
                            <strong>Logout</strong>
                        </button>
                    ) : (
                        <Link className="nav-account" to="/login">
                            <span>Hello, sign in</span>
                            <strong>Account</strong>
                        </Link>
                    )}

                    <NavLink className="nav-account" to="/orders">
                        <span>Returns</span>
                        <strong>& Orders</strong>
                    </NavLink>

                    <NavLink className="cart-link" to="/cart">
                        <span className="cart-count" aria-label={`${cartCount} items in cart`}>
                            {cartCount}
                        </span>
                        <span className="cart-mark">Cart</span>
                    </NavLink>

                </div>

            </div>

            <nav className="sub-nav" aria-label="Store navigation">
                <NavLink to="/" end>All</NavLink>
                <Link to="/?q=mobiles">Mobiles</Link>
                <Link to="/?q=electronics">Electronics</Link>
                <Link to="/?q=fashion">Fashion</Link>
                <Link to="/?q=home">Home</Link>
                <NavLink to="/wishlist">Wishlist</NavLink>
                <NavLink to="/orders">Orders</NavLink>
                <NavLink to="/checkout">Checkout</NavLink>
                {user?.role === "admin" && (
                    <NavLink to="/admin">Admin</NavLink>
                )}
                {!user && (
                    <>
                        <NavLink to="/login">Login</NavLink>
                        <NavLink to="/register">Register</NavLink>
                    </>
                )}
            </nav>

        </header>

    );

}

export default Navbar;
