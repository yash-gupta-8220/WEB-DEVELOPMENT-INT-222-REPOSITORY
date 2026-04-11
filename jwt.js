const jwt = require("jsonwebtoken");

const SECRET = "mysecretkey"; // same as server.js

// 🔐 CREATE TOKEN
function createToken(user) {
    return jwt.sign(
        { username: user.username },  // payload
        SECRET,
        { expiresIn: "1h" }
    );
}

// 🔐 VERIFY TOKEN (MIDDLEWARE)
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded; // attach user info
        next(); // continue
    } catch (err) {
        return res.status(403).json({ message: "Invalid token" });
    }
}

module.exports = { createToken, verifyToken };
