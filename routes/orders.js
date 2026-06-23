const express = require("express");
const router = express.Router();

const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

/*
=================================
PLACE ORDER
=================================
*/

router.post(
    "/place",
    authMiddleware,
    (req, res) => {

        const user_id = req.user.id;

        // Get cart items

        db.query(
            `
            SELECT
            cart.product_id,
            cart.quantity,
            products.price,
            products.stock

            FROM cart

            JOIN products
            ON cart.product_id = products.id

            WHERE cart.user_id = ?
            `,
            [user_id],
            (err, cart) => {

                if (err)
                    return res.status(500).json(err);

                if (cart.length === 0) {
                    return res.json({
                        message: "Cart is empty"
                    });
                }

                let total = 0;

                for (let item of cart) {

                    if (item.quantity > item.stock) {
                        return res.json({
                            message:
                            `Insufficient stock for product ${item.product_id}`
                        });
                    }

                    total += item.price * item.quantity;
                }

                // Create order

                db.query(
                    "INSERT INTO orders(user_id,total_amount) VALUES(?,?)",
                    [user_id, total],
                    (err, orderResult) => {

                        if (err)
                            return res.status(500).json(err);

                        const order_id = orderResult.insertId;

                        let completed = 0;

                        cart.forEach(item => {

                            // Save order item

                            db.query(
                                `
                                INSERT INTO order_items
                                (order_id,product_id,quantity,price)

                                VALUES(?,?,?,?)
                                `,
                                [
                                    order_id,
                                    item.product_id,
                                    item.quantity,
                                    item.price
                                ],
                                (err) => {

                                    if (err)
                                        return res.status(500).json(err);

                                    // Reduce stock

                                    db.query(
                                        `
                                        UPDATE products

                                        SET stock=stock-?

                                        WHERE id=?
                                        `,
                                        [
                                            item.quantity,
                                            item.product_id
                                        ]
                                    );

                                    completed++;

                                    if (completed === cart.length) {

                                        // Clear cart

                                        db.query(
                                            "DELETE FROM cart WHERE user_id=?",
                                            [user_id]
                                        );

                                        res.json({
                                            message:
                                            "Order placed successfully",

                                            order_id,

                                            total
                                        });

                                    }

                                }
                            );

                        });

                    }
                );

            }
        );

    }
);

router.get(
    "/",
    authMiddleware,
    (req, res) => {

        db.query(
            `
            SELECT
            id,
            total_amount,
            status,
            created_at

            FROM orders

            WHERE user_id=?

            ORDER BY created_at DESC
            `,
            [req.user.id],
            (err, result) => {

                if (err)
                    return res.status(500).json(err);

                res.json(result);

            }
        );

    }
);

/*
=================================
GET ORDER DETAILS
=================================
*/

router.get(
    "/:id",
    authMiddleware,
    (req, res) => {

        const orderId = req.params.id;
        const userId = req.user.id;

        // Get order

        db.query(
            `
            SELECT *
            FROM orders
            WHERE id=? AND user_id=?
            `,
            [orderId, userId],
            (err, orderResult) => {

                if (err)
                    return res.status(500).json(err);

                if (orderResult.length === 0) {
                    return res.status(404).json({
                        message: "Order not found"
                    });
                }

                // Get order items

                db.query(
                    `
                    SELECT
                    order_items.product_id,
                    products.name,
                    order_items.quantity,
                    order_items.price

                    FROM order_items

                    JOIN products
                    ON order_items.product_id = products.id

                    WHERE order_items.order_id=?
                    `,
                    [orderId],
                    (err, itemResult) => {

                        if (err)
                            return res.status(500).json(err);

                        res.json({
                            order: orderResult[0],
                            items: itemResult
                        });

                    }
                );

            }
        );

    }
);

/*
=================================
CANCEL ORDER
=================================
*/

router.put(
    "/cancel/:id",
    authMiddleware,
    (req, res) => {

        const orderId = req.params.id;
        const userId = req.user.id;

        // Check order

        db.query(
            "SELECT * FROM orders WHERE id=? AND user_id=?",
            [orderId, userId],
            (err, orderResult) => {

                if (err)
                    return res.status(500).json(err);

                if (orderResult.length === 0) {
                    return res.status(404).json({
                        message: "Order not found"
                    });
                }

                const order = orderResult[0];

                if (order.status !== "Pending") {
                    return res.json({
                        message: "Only pending orders can be cancelled"
                    });
                }

                // Cancel order

                db.query(
                    "UPDATE orders SET status='Cancelled' WHERE id=?",
                    [orderId],
                    (err) => {

                        if (err)
                            return res.status(500).json(err);

                        // Get ordered items

                        db.query(
                            "SELECT * FROM order_items WHERE order_id=?",
                            [orderId],
                            (err, items) => {

                                if (err)
                                    return res.status(500).json(err);

                                items.forEach(item => {

                                    // Restore stock

                                    db.query(
                                        "UPDATE products SET stock=stock+? WHERE id=?",
                                        [
                                            item.quantity,
                                            item.product_id
                                        ]
                                    );

                                });

                                res.json({
                                    message: "Order cancelled successfully"
                                });

                            }
                        );

                    }
                );

            }
        );

    }
);

module.exports = router;