const express = require("express");
const router = express.Router();

const db = require("../config/db");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");


router.get("/", (req, res) => {

    db.query(
        "SELECT * FROM products",
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(result);

        }
    );

});

router.get("/search", (req, res) => {

    const keyword = "%" + (req.query.name || "") + "%";

    db.query(
        "SELECT * FROM products WHERE name LIKE ?",
        [keyword],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(result);

        }
    );

});

router.get("/category/:category", (req, res) => {

    db.query(
        "SELECT * FROM products WHERE category=?",
        [req.params.category],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(result);

        }
    );

});

router.get("/:id", (req, res) => {

    db.query(
        "SELECT * FROM products WHERE id=?",
        [req.params.id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (result.length === 0) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }

            res.json(result[0]);

        }
    );

});

router.post(
    "/add",
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
            `INSERT INTO products
            (name,description,price,category,brand,stock,image)
            VALUES(?,?,?,?,?,?,?)`,
            [
                name,
                description,
                price,
                category,
                brand,
                stock,
                image
            ],
            (err) => {

                if (err)
                    return res.status(500).json(err);

                res.json({
                    message: "Product added successfully"
                });

            }
        );

    }
);

router.put(
    "/:id",
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
            `UPDATE products
             SET
             name=?,
             description=?,
             price=?,
             category=?,
             brand=?,
             stock=?,
             image=?
             WHERE id=?`,
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
    "/:id",
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

module.exports = router;