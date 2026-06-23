const express = require("express");
const router = express.Router();

const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

/*
==================================
ADD TO CART
Amazon-style:
✓ Check stock
✓ Update quantity if exists
✓ Prevent duplicates
✓ Max quantity = 10
==================================
*/

router.post("/add", authMiddleware, (req, res) => {

    const user_id = req.user.id;
    const { product_id, quantity } = req.body;

    const qty = quantity || 1;

    // Check product stock

    db.query(
        "SELECT stock FROM products WHERE id=?",
        [product_id],
        (err, product) => {

            if (err)
                return res.status(500).json(err);

            if (product.length === 0) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }

            const stock = product[0].stock;

            // Check existing cart item

            db.query(
                "SELECT * FROM cart WHERE user_id=? AND product_id=?",
                [user_id, product_id],
                (err, cart) => {

                    if (err)
                        return res.status(500).json(err);

                    if (cart.length > 0) {

                        const newQty = cart[0].quantity + qty;

                        if (newQty > stock) {
                            return res.json({
                                message: `Only ${stock} items available`
                            });
                        }

                        if (newQty > 10) {
                            return res.json({
                                message: "Maximum quantity reached"
                            });
                        }

                        db.query(
                            "UPDATE cart SET quantity=? WHERE id=?",
                            [newQty, cart[0].id],
                            (err) => {

                                if (err)
                                    return res.status(500).json(err);

                                res.json({
                                    message: "Cart quantity updated"
                                });

                            }
                        );

                    } else {

                        if (qty > stock) {
                            return res.json({
                                message: `Only ${stock} items available`
                            });
                        }

                        if (qty > 10) {
                            return res.json({
                                message: "Maximum quantity reached"
                            });
                        }

                        db.query(
                            "INSERT INTO cart(user_id,product_id,quantity) VALUES(?,?,?)",
                            [user_id, product_id, qty],
                            (err) => {

                                if (err)
                                    return res.status(500).json(err);

                                res.json({
                                    message: "Product added to cart"
                                });

                            }
                        );

                    }

                }
            );

        }
    );

});

/*
=====================
VIEW CART
=====================
*/

router.get("/", authMiddleware, (req, res) => {

    db.query(
        `
        SELECT
        cart.id,
        products.name,
        products.price,
        products.image,
        cart.quantity,
        (products.price*cart.quantity) AS total

        FROM cart

        JOIN products
        ON cart.product_id=products.id

        WHERE cart.user_id=?
        `,
        [req.user.id],
        (err, result) => {

            if (err)
                return res.status(500).json(err);

            let subtotal = 0;
            let totalItems = 0;

            result.forEach(item => {
                subtotal += Number(item.total);
                totalItems += item.quantity;
            });

            res.json({
                items: result,
                totalItems,
                subtotal
            });

        }
    );

});

/*
=====================
UPDATE QUANTITY
=====================
*/

router.put("/update", authMiddleware, (req, res) => {

    const { cart_id, quantity } = req.body;

    db.query(
        "UPDATE cart SET quantity=? WHERE id=? AND user_id=?",
        [
            quantity,
            cart_id,
            req.user.id
        ],
        (err) => {

            if (err)
                return res.status(500).json(err);

            res.json({
                message: "Cart updated"
            });

        }
    );

});

/*
=====================
REMOVE ITEM
=====================
*/

router.delete("/:id", authMiddleware, (req, res) => {

    db.query(
        "DELETE FROM cart WHERE id=? AND user_id=?",
        [
            req.params.id,
            req.user.id
        ],
        (err) => {

            if (err)
                return res.status(500).json(err);

            res.json({
                message: "Item removed"
            });

        }
    );

});

module.exports = router;