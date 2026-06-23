const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

const jwt = require("jsonwebtoken");

const db = require("../config/db");

const authMiddleware = require("../middleware/authMiddleware");

// Registration Route
router.get("/register", (req, res) => {
    res.send("Register endpoint. Use POST to create a new user.");
});

router.post("/register", async (req, res) => {

    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Please fill all required fields"
        });
    }

    db.query(
        "SELECT * FROM users WHERE email=?",
        [email],
        async (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (result.length > 0) {
                return res.status(400).json({
                    message: "Email already exists"
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            db.query(
                "INSERT INTO users(name,email,password,phone,address) VALUES(?,?,?,?,?)",
                [
                    name,
                    email,
                    hashedPassword,
                    phone,
                    address
                ],
                (err, result) => {

                    if (err) {
                        return res.status(500).json(err);
                    }

                    res.status(201).json({
                        message: "User registered successfully"
                    });

                }
            );

        }
    );

});

router.get("/login", (req, res) => {
    res.send("Login endpoint. Use POST to log in.");
});

router.post("/login", (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    db.query(
        "SELECT * FROM users WHERE email=?",
        [email],
        async (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (result.length === 0) {
                return res.status(400).json({
                    message: "User not found"
                });
            }

            const user = result[0];

            const isMatch = await bcrypt.compare(
                password,
                user.password
            );

            if (!isMatch) {
                return res.status(400).json({
                    message: "Invalid password"
                });
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    role: user.role
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "24h"
                }
            );

            res.json({
                message: "Login successful",
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });

        }
    );

});

router.get(
    "/profile",
    authMiddleware,
    (req, res) => {
        res.json({
            message: "Protected Route",
            user: req.user
        });
    }
);

module.exports = router;