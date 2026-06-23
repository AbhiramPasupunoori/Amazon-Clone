const express = require("express");
const router = express.Router();

const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

router.post(
    "/cod",
    authMiddleware,
    (req, res) => {

        const { order_id } = req.body;

        db.query(
            "SELECT * FROM payments WHERE order_id=?",
            [order_id],
            (err, result) => {

                if (err)
                    return res.status(500).json(err);

                if (result.length > 0) {
                    return res.json({
                        message: "Payment already exists for this order"
                    });
                }

                db.query(
                    `
                    INSERT INTO payments
                    (order_id,payment_method,payment_status)

                    VALUES(?,?,?)
                    `,
                    [
                        order_id,
                        "COD",
                        "Pending"
                    ],
                    (err) => {

                        if (err)
                            return res.status(500).json(err);

                        res.json({
                            message: "Cash on Delivery selected"
                        });

                    }
                );

            }
        );

    }
);

/*
=================================
PAYMENT HISTORY
=================================
*/

router.get(
    "/",
    authMiddleware,
    (req, res) => {

        db.query(
            `
            SELECT

            payments.id,
            payments.order_id,
            payments.payment_method,
            payments.payment_status,
            payments.transaction_id,
            payments.created_at

            FROM payments

            JOIN orders
            ON payments.order_id = orders.id

            WHERE orders.user_id=?

            ORDER BY payments.created_at DESC
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

/*
=================================
PAYMENT DETAILS
=================================
*/

router.get(
    "/:id",
    authMiddleware,
    (req, res) => {

        const paymentId = req.params.id;

        db.query(
            `
            SELECT
            payments.*,
            orders.total_amount,
            orders.status AS order_status

            FROM payments

            JOIN orders
            ON payments.order_id = orders.id

            WHERE payments.id=?
            `,
            [paymentId],
            (err, result) => {

                if (err) {
                    return res.status(500).json(err);
                }

                if (result.length === 0) {
                    return res.status(404).json({
                        message: "Payment not found"
                    });
                }

                res.json(result[0]);

            }
        );

    }
);

module.exports = router;