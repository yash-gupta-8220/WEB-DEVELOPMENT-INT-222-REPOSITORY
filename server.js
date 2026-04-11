const express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 3000;
const SECRET = "mysecretkey";

app.use(express.json());
app.use(express.static(__dirname));

// =============================
// 👤 LOAD USERS FROM FILE
// =============================
let users = [];

if (fs.existsSync("users.json")) {
    users = JSON.parse(fs.readFileSync("users.json"));
}

// =============================
// 💡 LOAD IDEAS FROM FILE
// =============================
let ideas = [];

if (fs.existsSync("data.json")) {
    ideas = JSON.parse(fs.readFileSync("data.json"));
}

// =============================
// 🔐 REGISTER
// =============================
app.post("/register", (req, res) => {
    const { username, password } = req.body;

    // check if user exists
    const existing = users.find(u => u.username === username);
    if (existing) {
        return res.json({ message: "User already exists" });
    }

    users.push({ username, password });

    fs.writeFileSync("users.json", JSON.stringify(users, null, 2));

    res.json({ message: "User registered successfully" });
});

// =============================
// 🔐 LOGIN
// =============================
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u =>
        u.username === username && u.password === password
    );

    if (!user) {
        return res.json({ message: "Login failed" });
    }

    const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });

    res.json({ token });
});

// =============================
// 🛡️ AUTH MIDDLEWARE
// =============================
function auth(req, res, next) {
    const token = req.headers["authorization"];

    if (!token) {
        return res.send("No token");
    }

    try {
        const data = jwt.verify(token, SECRET);
        req.user = data;
        next();
    } catch {
        res.send("Invalid token");
    }
}

// =============================
// ➕ ADD IDEA (PROTECTED)
// =============================
app.post("/add", auth, (req, res) => {
    const newIdea = {
        id: Date.now(),
        title: req.body.title,
        description: req.body.description,
        domain: req.body.domain,
        user: req.user.username,
        likes: 0
    };

    ideas.push(newIdea);

    fs.writeFileSync("data.json", JSON.stringify(ideas, null, 2));

    res.json({ message: "Idea added" });
});

// =============================
// 📥 GET IDEAS
// =============================
app.get("/ideas", (req, res) => {
    res.json(ideas);
});

// =============================
// ❤️ LIKE
// =============================
app.post("/like/:id", (req, res) => {
    const idea = ideas.find(i => i.id == req.params.id);

    if (idea) {
        idea.likes++;
        fs.writeFileSync("data.json", JSON.stringify(ideas, null, 2));
    }

    res.json({ message: "Liked" });
});

// =============================
// 🚀 START SERVER
// =============================
app.listen(PORT, () => {
    console.log (`Server running on port ${PORT}`);
});
