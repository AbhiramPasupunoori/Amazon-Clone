const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization;

    console.log("AUTH HEADER:", authHeader);

    if (!authHeader) {
        return res.status(403).json({
            message: "Access denied. Token missing."
        });
    }

    const token = authHeader.split(" ")[1];

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log("DECODED:", decoded);

        req.user = decoded;

        next();

    } catch (err) {

        console.log("JWT ERROR:", err.message);

        return res.status(401).json({
            message: "Invalid or expired token."
        });

    }

};

module.exports = authMiddleware;