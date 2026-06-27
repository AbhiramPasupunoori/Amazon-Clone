import { useCallback, useContext, useEffect, useState } from "react";

import API from "../services/api";
import { AuthContext } from "../context/auth-context";

const emptyProduct = {
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    stock: "",
    image: ""
};

const orderStatuses = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled"
];

function AdminDashboard() {

    const { user } = useContext(AuthContext);

    const [analytics, setAnalytics] =
        useState({
            totalRevenue: 0,
            totalOrders: 0,
            totalUsers: 0
        });

    const [users, setUsers] =
        useState([]);

    const [orders, setOrders] =
        useState([]);

    const [payments, setPayments] =
        useState([]);

    const [products, setProducts] =
        useState([]);

    const [bestProducts, setBestProducts] =
        useState([]);

    const [monthlySales, setMonthlySales] =
        useState([]);

    const [productForm, setProductForm] =
        useState(emptyProduct);

    const [editingProductId, setEditingProductId] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [message, setMessage] =
        useState("");

    const loadDashboard = useCallback(async () => {

        setLoading(true);

        try {

            const [
                analyticsRes,
                usersRes,
                ordersRes,
                paymentsRes,
                productsRes,
                bestProductsRes,
                monthlySalesRes
            ] = await Promise.all([
                API.get("/admin/analytics"),
                API.get("/admin/users"),
                API.get("/admin/orders"),
                API.get("/admin/payments"),
                API.get("/products"),
                API.get("/admin/reports/best-products"),
                API.get("/admin/reports/monthly-sales")
            ]);

            setAnalytics(analyticsRes.data || {});
            setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
            setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
            setPayments(Array.isArray(paymentsRes.data) ? paymentsRes.data : []);
            setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
            setBestProducts(Array.isArray(bestProductsRes.data) ? bestProductsRes.data : []);
            setMonthlySales(Array.isArray(monthlySalesRes.data) ? monthlySalesRes.data : []);

        } catch (error) {

            console.error(error);
            setMessage("Admin data could not be loaded. Please sign in as an admin.");

        } finally {

            setLoading(false);

        }

    }, []);

    useEffect(() => {

        loadDashboard();

    }, [loadDashboard]);

    const updateProductField = (field, value) => {
        setProductForm({
            ...productForm,
            [field]: value
        });
    };

    const resetProductForm = () => {
        setProductForm(emptyProduct);
        setEditingProductId(null);
    };

    const saveProduct = async (event) => {

        event.preventDefault();
        setMessage("");

        try {

            const payload = {
                ...productForm,
                price: Number(productForm.price),
                stock: Number(productForm.stock)
            };

            if (editingProductId) {
                await API.put(`/admin/products/${editingProductId}`, payload);
            } else {
                await API.post("/products/add", payload);
            }

            resetProductForm();
            setMessage(editingProductId ? "Product updated successfully." : "Product added successfully.");
            loadDashboard();

        } catch (error) {

            console.error(error);
            setMessage(editingProductId ? "Unable to update product." : "Unable to add product.");

        }

    };

    const editProduct = (product) => {
        setEditingProductId(product.id);
        setProductForm({
            name: product.name || "",
            description: product.description || "",
            price: product.price || "",
            category: product.category || "",
            brand: product.brand || "",
            stock: product.stock || "",
            image: product.image || ""
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const deleteProduct = async (id) => {

        try {

            await API.delete(`/admin/products/${id}`);
            setMessage("Product deleted.");
            if (editingProductId === id) {
                resetProductForm();
            }
            loadDashboard();

        } catch (error) {

            console.error(error);
            setMessage("Unable to delete product.");

        }

    };

    const deleteUser = async (id) => {

        try {

            await API.delete(`/admin/users/${id}`);
            setMessage("User deleted.");
            loadDashboard();

        } catch (error) {

            console.error(error);
            setMessage("Unable to delete user.");

        }

    };

    const updateOrderStatus = async (id, status) => {

        try {

            await API.put(`/admin/orders/${id}`, {
                status
            });

            setMessage("Order status updated.");
            loadDashboard();

        } catch (error) {

            console.error(error);
            setMessage("Unable to update order status.");

        }

    };

    if (user?.role && user.role !== "admin") {
        return (
            <div className="page-wrap">
                <div className="empty-state">
                    <h1>Admin access required</h1>
                    <p>Sign in with an admin account to manage products, users and orders.</p>
                </div>
            </div>
        );
    }

    return (

        <div className="page-wrap admin-page">

            <div className="page-heading split">
                <div>
                    <p className="eyebrow">Admin console</p>
                    <h1>Dashboard</h1>
                    <p>Manage storefront activity, catalog inventory and recent orders.</p>
                </div>
                <button
                    className="secondary-button"
                    type="button"
                    onClick={loadDashboard}
                >
                    Refresh
                </button>
            </div>

            {message && (
                <div className="notice compact">
                    {message}
                </div>
            )}

            {loading ? (
                <div className="loading-panel">Loading dashboard...</div>
            ) : (
                <>
                    <section className="stats-grid">
                        <article className="stat-card">
                            <span>Total revenue</span>
                            <strong>₹{Number(analytics.totalRevenue || 0).toLocaleString("en-IN")}</strong>
                        </article>
                        <article className="stat-card">
                            <span>Orders</span>
                            <strong>{analytics.totalOrders || 0}</strong>
                        </article>
                        <article className="stat-card">
                            <span>Users</span>
                            <strong>{analytics.totalUsers || 0}</strong>
                        </article>
                        <article className="stat-card">
                            <span>Products</span>
                            <strong>{products.length}</strong>
                        </article>
                    </section>

                    <section className="admin-grid">
                        <article className="admin-panel">
                            <div className="panel-title-row">
                                <h2>{editingProductId ? "Edit Product" : "Add Product"}</h2>
                                {editingProductId && (
                                    <button
                                        className="text-button"
                                        type="button"
                                        onClick={resetProductForm}
                                    >
                                        Cancel edit
                                    </button>
                                )}
                            </div>
                            <form className="admin-form" onSubmit={saveProduct}>
                                <input
                                    placeholder="Product name"
                                    value={productForm.name}
                                    onChange={(event) => updateProductField("name", event.target.value)}
                                    required
                                />
                                <input
                                    placeholder="Brand"
                                    value={productForm.brand}
                                    onChange={(event) => updateProductField("brand", event.target.value)}
                                    required
                                />
                                <input
                                    placeholder="Category"
                                    value={productForm.category}
                                    onChange={(event) => updateProductField("category", event.target.value)}
                                    required
                                />
                                <input
                                    placeholder="Price"
                                    type="number"
                                    min="0"
                                    value={productForm.price}
                                    onChange={(event) => updateProductField("price", event.target.value)}
                                    required
                                />
                                <input
                                    placeholder="Stock"
                                    type="number"
                                    min="0"
                                    value={productForm.stock}
                                    onChange={(event) => updateProductField("stock", event.target.value)}
                                    required
                                />
                                <input
                                    placeholder="Image URL"
                                    value={productForm.image}
                                    onChange={(event) => updateProductField("image", event.target.value)}
                                />
                                <textarea
                                    placeholder="Description"
                                    value={productForm.description}
                                    onChange={(event) => updateProductField("description", event.target.value)}
                                    required
                                />
                                <button className="primary-button" type="submit">
                                    {editingProductId ? "Update product" : "Add product"}
                                </button>
                            </form>
                        </article>

                        <article className="admin-panel">
                            <h2>Best Products</h2>
                            <div className="simple-list">
                                {bestProducts.length > 0 ? bestProducts.slice(0, 6).map((product) => (
                                    <div key={product.id}>
                                        <span>{product.name}</span>
                                        <strong>{product.totalSold || 0} sold</strong>
                                    </div>
                                )) : (
                                    <p>No sales data yet.</p>
                                )}
                            </div>
                        </article>

                        <article className="admin-panel">
                            <h2>Monthly Sales</h2>
                            <div className="simple-list">
                                {monthlySales.length > 0 ? monthlySales.slice(0, 6).map((month) => (
                                    <div key={month.month}>
                                        <span>{month.month}</span>
                                        <strong>
                                            ₹{Number(month.revenue || 0).toLocaleString("en-IN")}
                                        </strong>
                                    </div>
                                )) : (
                                    <p>No monthly report yet.</p>
                                )}
                            </div>
                        </article>
                    </section>

                    <section className="admin-panel">
                        <h2>Products</h2>
                        <div className="table-wrap">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product.id}>
                                            <td>{product.name}</td>
                                            <td>{product.category}</td>
                                            <td>₹{Number(product.price || 0).toLocaleString("en-IN")}</td>
                                            <td>{product.stock}</td>
                                            <td>
                                                <div className="table-actions">
                                                    <button
                                                        className="text-button"
                                                        type="button"
                                                        onClick={() => editProduct(product)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="text-button danger"
                                                        type="button"
                                                        onClick={() => deleteProduct(product.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="admin-panel">
                        <h2>Orders</h2>
                        <div className="table-wrap">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Order</th>
                                        <th>Customer</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order.id}>
                                            <td>#{order.id}</td>
                                            <td>{order.name || order.email}</td>
                                            <td>₹{Number(order.total_amount || 0).toLocaleString("en-IN")}</td>
                                            <td>
                                                <select
                                                    value={order.status || "Pending"}
                                                    onChange={(event) =>
                                                        updateOrderStatus(order.id, event.target.value)
                                                    }
                                                >
                                                    {orderStatuses.map((status) => (
                                                        <option key={status} value={status}>
                                                            {status}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="admin-grid">
                        <article className="admin-panel">
                            <h2>Users</h2>
                            <div className="simple-list">
                                {users.map((storeUser) => (
                                    <div key={storeUser.id}>
                                        <span>
                                            {storeUser.name}
                                            <small>{storeUser.email}</small>
                                        </span>
                                        <button
                                            className="text-button danger"
                                            type="button"
                                            onClick={() => deleteUser(storeUser.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </article>

                        <article className="admin-panel">
                            <h2>Payments</h2>
                            <div className="simple-list">
                                {payments.map((payment) => (
                                    <div key={payment.id}>
                                        <span>
                                            Order #{payment.order_id}
                                            <small>{payment.payment_method}</small>
                                        </span>
                                        <strong>{payment.payment_status}</strong>
                                    </div>
                                ))}
                            </div>
                        </article>
                    </section>
                </>
            )}

        </div>

    );

}

export default AdminDashboard;
