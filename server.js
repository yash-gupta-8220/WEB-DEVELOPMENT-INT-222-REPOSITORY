const express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

// ===== SECRET =====
const SECRET = process.env.SECRET || "mysecretkey";

// ===== USERS =====
let users = [];

if (fs.existsSync("users.json")) {
    users = JSON.parse(fs.readFileSync("users.json"));
}

// ===== IDEAS =====
let ideas = [];

if (fs.existsSync("data.json")) {
    ideas = JSON.parse(fs.readFileSync("data.json"));
}

// ===== AUTH =====
function auth(req, res, next) {
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

// ===== REGISTER =====
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    users.push({ username, password: hashed });

    fs.writeFileSync("users.json", JSON.stringify(users, null, 2));

    res.json({ message: "User registered ✅" });
});

// ===== LOGIN =====
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);

    if (!user) {
        return res.json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        return res.json({ message: "Wrong password" });
    }

    const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });

    res.json({ token });
});

// ===== ADD IDEA (PROTECTED) =====
app.post("/add", auth, (req, res) => {
    ideas.push(req.body);

    fs.writeFileSync("data.json", JSON.stringify(ideas, null, 2));

    res.json({ message: "Idea saved successfully ✅" });
});

// ===== GET IDEAS =====
app.get("/ideas", (req, res) => {
    res.json(ideas);
});

// ===== DELETE IDEA =====
app.delete("/delete/:index", auth, (req, res) => {
    const index = req.params.index;

    ideas.splice(index, 1);

    fs.writeFileSync("data.json", JSON.stringify(ideas, null, 2));

    res.json({ message: "Idea deleted 🗑️" });
});

// ===== SERVER =====
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(Server running on port ${PORT});
});
