import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {

    return (
        <BrowserRouter>

            <div className="app-shell">

                <Navbar />

                <main className="app-main">

                    <Routes>

                        <Route path="/" element={<Home />} />

                        <Route path="/login" element={<Login />} />

                        <Route path="/register" element={<Register />} />

                        <Route path="/products/:id" element={<ProductDetails />} />

                        <Route
                            path="/cart"
                            element={(
                                <ProtectedRoute>
                                    <Cart />
                                </ProtectedRoute>
                            )}
                        />

                        <Route
                            path="/wishlist"
                            element={(
                                <ProtectedRoute>
                                    <Wishlist />
                                </ProtectedRoute>
                            )}
                        />

                        <Route
                            path="/checkout"
                            element={(
                                <ProtectedRoute>
                                    <Checkout />
                                </ProtectedRoute>
                            )}
                        />

                        <Route
                            path="/orders"
                            element={(
                                <ProtectedRoute>
                                    <Orders />
                                </ProtectedRoute>
                            )}
                        />

                        <Route
                            path="/admin"
                            element={(
                                <ProtectedRoute>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            )}
                        />

                        <Route path="*" element={<Home />} />

                    </Routes>

                </main>

                <footer className="site-footer">
                    <button
                        className="back-to-top"
                        onClick={() => window.scrollTo({
                            top: 0,
                            behavior: "smooth"
                        })}
                    >
                        Back to top
                    </button>

                    <div className="footer-grid">
                        <div>
                            <h3>Get to Know Us</h3>
                            <p>Careers</p>
                            <p>About Amazon Clone</p>
                            <p>Investor Relations</p>
                        </div>

                        <div>
                            <h3>Make Money with Us</h3>
                            <p>Sell products</p>
                            <p>Affiliate program</p>
                            <p>Advertise items</p>
                        </div>

                        <div>
                            <h3>Let Us Help You</h3>
                            <p>Your Account</p>
                            <p>Returns Centre</p>
                            <p>Customer Service</p>
                        </div>
                    </div>
                </footer>

            </div>

        </BrowserRouter>
    );

}

export default App;
