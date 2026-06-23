const express = require("express");
const router = express.Router();

const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

router.post(
    "/add",
    authMiddleware,
    (req, res) => {

        const user_id = req.user.id;
        const { product_id } = req.body;

        db.query(
            "SELECT * FROM wishlist WHERE user_id=? AND product_id=?",
            [user_id, product_id],
            (err, result) => {

                if (err) {
                    return res.status(500).json(err);
                }

                if (result.length > 0) {
                    return res.json({
                        message: "Product already in wishlist"
                    });
                }

                db.query(
                    "INSERT INTO wishlist(user_id, product_id) VALUES(?,?)",
                    [user_id, product_id],
                    (err) => {

                        if (err) {
                            return res.status(500).json(err);
                        }

                        res.json({
                            message: "Product added to wishlist"
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
                wishlist.id,
                products.name,
                products.price,
                products.image
            FROM wishlist

            JOIN products
            ON wishlist.product_id = products.id

            WHERE wishlist.user_id = ?
            `,
            [req.user.id],
            (err, result) => {

                if (err) {
                    return res.status(500).json(err);
                }

                res.json(result);

            }
        );

    }
);

router.delete(
    "/:id",
    authMiddleware,
    (req, res) => {

        db.query(
            "DELETE FROM wishlist WHERE id=? AND user_id=?",
            [
                req.params.id,
                req.user.id
            ],
            (err) => {

                if (err) {
                    return res.status(500).json(err);
                }

                res.json({
                    message: "Wishlist item removed"
                });

            }
        );

    }
);

router.post(
    "/move-to-cart/:id",
    authMiddleware,
    (req, res) => {

        const wishlist_id = req.params.id;
        const user_id = req.user.id;

        db.query(
            "SELECT * FROM wishlist WHERE id=? AND user_id=?",
            [wishlist_id, user_id],
            (err, wishlist) => {

                if (err)
                    return res.status(500).json(err);

                if (wishlist.length === 0) {
                    return res.status(404).json({
                        message: "Wishlist item not found"
                    });
                }

                const product_id = wishlist[0].product_id;

                // Check stock

                db.query(
                    "SELECT stock FROM products WHERE id=?",
                    [product_id],
                    (err, product) => {

                        if (err)
                            return res.status(500).json(err);

                        const stock = product[0].stock;

                        // Check cart

                        db.query(
                            "SELECT * FROM cart WHERE user_id=? AND product_id=?",
                            [user_id, product_id],
                            (err, cart) => {

                                if (err)
                                    return res.status(500).json(err);

                                if (cart.length > 0) {

                                    const newQty =
                                        cart[0].quantity + 1;

                                    if (newQty > stock) {
                                        return res.json({
                                            message:
                                                "Stock limit reached"
                                        });
                                    }

                                    if (newQty > 10) {
                                        return res.json({
                                            message:
                                                "Maximum quantity reached"
                                        });
                                    }

                                    db.query(
                                        "UPDATE cart SET quantity=? WHERE id=?",
                                        [
                                            newQty,
                                            cart[0].id
                                        ],
                                        afterCart
                                    );

                                } else {

                                    db.query(
                                        "INSERT INTO cart(user_id,product_id,quantity) VALUES(?,?,1)",
                                        [
                                            user_id,
                                            product_id
                                        ],
                                        afterCart
                                    );

                                }

                            }
                        );

                        function afterCart(err) {

                            if (err)
                                return res.status(500).json(err);

                            db.query(
                                "DELETE FROM wishlist WHERE id=?",
                                [wishlist_id],
                                (err) => {

                                    if (err)
                                        return res.status(500).json(err);

                                    res.json({
                                        message:
                                            "Product moved to cart"
                                    });

                                }
                            );

                        }

                    }
                );

            }
        );

    }
);

module.exports = router;