import { Link } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";

function Navbar() {

    const { user, logout } =
        useContext(AuthContext);

    return (

        <nav>

            <Link to="/">
                Home
            </Link>

            {" | "}

            <Link to="/cart">
                Cart
            </Link>

            {" | "}

            <Link to="/wishlist">
                Wishlist
            </Link>

            {" | "}

            {user ? (

                <>
                    <button
                        onClick={logout}
                    >
                        Logout
                    </button>
                </>

            ) : (

                <>
                    <Link to="/login">
                        Login
                    </Link>

                    {" | "}

                    <Link to="/register">
                        Register
                    </Link>
                </>

            )}

        </nav>

    );

}

export default Navbar;