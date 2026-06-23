const express = require("express");
const router = express.Router();

const db = require("../config/db");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get(
    "/users",
    authMiddleware,
    adminMiddleware,
    (req, res) => {

        db.query(
            `
            SELECT
                id,
                name,
                email,
                phone,
                role,
                created_at
            FROM users
            `,
            (err, result) => {

                if (err) {
                    return res.status(500).json(err);
                }

                res.json(result);

            }
        );

    }
);

router.get(
    "/orders",
    authMiddleware,
    adminMiddleware,
    (req, res) => {

        db.query(
            `
            SELECT
                orders.*,
                users.name,
                users.email

            FROM orders

            JOIN users
            ON orders.user_id = users.id

            ORDER BY orders.created_at DESC
            `,
            (err, result) => {

                if (err) {
                    return res.status(500).json(err);
                }

                res.json(result);

            }
        );

    }
);

router.get(
    "/payments",
    authMiddleware,
    adminMiddleware,
    (req, res) => {

        db.query(
            `
            SELECT
                payments.*,
                users.name,
                users.email

            FROM payments

            JOIN orders
            ON payments.order_id = orders.id

            JOIN users
            ON orders.user_id = users.id
            `,
            (err, result) => {

                if (err) {
                    return res.status(500).json(err);
                }

                res.json(result);

            }
        );

    }
);

router.put(
    "/orders/:id",
    authMiddleware,
    adminMiddleware,
    (req, res) => {

        const { status } = req.body;

        db.query(
            `
            UPDATE orders
            SET status=?
            WHERE id=?
            `,
            [
                status,
                req.params.id
            ],
            (err) => {

                if (err) {
                    return res.status(500).json(err);
                }

                res.json({
                    message: "Order status updated"
                });

            }
        );

    }

);

router.delete(
    "/users/:id",
    authMiddleware,
    adminMiddleware,
    (req, res) => {

        db.query(
            "DELETE FROM users WHERE id=?",
            [req.params.id],
            (err) => {

                if (err) {
                    return res.status(500).json(err);
                }

                res.json({
                    message: "User deleted successfully"
                });

            }
        );

    }
);

router.get(
    "/analytics",
    authMiddleware,
    adminMiddleware,
    (req, res) => {

        db.query(
            `
            SELECT
                SUM(total_amount) AS revenue,
                COUNT(*) AS totalOrders
            FROM orders
            WHERE status != 'Cancelled'
            `,
            (err, revenueData) => {

                if (err)
                    return res.status(500).json(err);

                db.query(
                    `
                    SELECT
                        COUNT(*) AS totalUsers
                    FROM users
                    `,
                    (err, userData) => {

                        if (err)
                            return res.status(500).json(err);

                        res.json({

                            totalRevenue:
                                revenueData[0].revenue || 0,

                            totalOrders:
                                revenueData[0].totalOrders,

                            totalUsers:
                                userData[0].totalUsers

                        });

                    }
                );

            }
        );

    }
);

router.put(
    "/products/:id",
    authMiddleware,
    adminMiddleware,
    (req, res) => {

        const {
            name,
            description,
            price,
            category,
            brand,
            stock,
            image
        } = req.body;

        db.query(
            `
            UPDATE products
            SET
                name=?,
                description=?,
                price=?,
                category=?,
                brand=?,
                stock=?,
                image=?
            WHERE id=?
            `,
            [
                name,
                description,
                price,
                category,
                brand,
                stock,
                image,
                req.params.id
            ],
            (err) => {

                if (err) {
                    return res.status(500).json(err);
                }

                res.json({
                    message: "Product updated successfully"
                });

            }
        );

    }
);

router.delete(
    "/products/:id",
    authMiddleware,
    adminMiddleware,
    (req, res) => {

        db.query(
            "DELETE FROM products WHERE id=?",
            [req.params.id],
            (err) => {

                if (err) {
                    return res.status(500).json(err);
                }

                res.json({
                    message: "Product deleted successfully"
                });

            }
        );

    }
);

router.get(
    "/reports/best-products",
    authMiddleware,
    adminMiddleware,
    (req, res) => {

        db.query(
            `
            SELECT
                products.id,
                products.name,
                SUM(order_items.quantity) AS totalSold

            FROM order_items

            JOIN products
            ON order_items.product_id = products.id

            GROUP BY products.id

            ORDER BY totalSold DESC
            `,
            (err, result) => {

                if (err) {
                    return res.status(500).json(err);
                }

                res.json(result);

            }
        );

    }
);

router.get(
    "/reports/monthly-sales",
    authMiddleware,
    adminMiddleware,
    (req, res) => {

        db.query(
            `
            SELECT

            DATE_FORMAT(
                created_at,
                '%Y-%m'
            ) AS month,

            SUM(total_amount) AS revenue,

            COUNT(*) AS orders

            FROM orders

            WHERE status != 'Cancelled'

            GROUP BY month

            ORDER BY month DESC
            `,
            (err, result) => {

                if (err) {
                    return res.status(500).json(err);
                }

                res.json(result);

            }
        );

    }
);

module.exports = router;