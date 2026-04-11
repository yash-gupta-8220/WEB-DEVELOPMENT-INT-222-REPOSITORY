const express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 3000;
const SECRET = "mysecretkey";

app.use(express.json());
app.use(express.static(__dirname));

// =============================
// 👤 USERS (TEMP STORAGE)
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

    users.push({ username, password });

    res.json({ message: "User registered successfully" });
});

// =============================
// 🔐 LOGIN (JWT)
// =============================
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => 
        u.username === username && u.password === password
    );

    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful", token });
});

// =============================
// 🛡️ AUTH MIDDLEWARE
// =============================
function auth(req, res, next) {
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
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
        likes: 0,
        comments: [],
        updates: []
    };

    ideas.push(newIdea);

    fs.writeFileSync("data.json", JSON.stringify(ideas, null, 2));

    res.json({ message: "Idea added successfully" });
});

// =============================
// 📥 GET ALL IDEAS
// =============================
app.get("/ideas", (req, res) => {
    res.json(ideas);
});

// =============================
// ❤️ LIKE IDEA
// =============================
app.post("/like/:id", (req, res) => {
    const idea = ideas.find(i => i.id == req.params.id);

    if (!idea) return res.send("Idea not found");

    idea.likes++;
    fs.writeFileSync("data.json", JSON.stringify(ideas, null, 2));

    res.json({ message: "Liked", likes: idea.likes });
});

// =============================
// 💬 ADD COMMENT
// =============================
app.post("/comment/:id", (req, res) => {
    const idea = ideas.find(i => i.id == req.params.id);

    if (!idea) return res.send("Idea not found");

    idea.comments.push(req.body.comment);

    fs.writeFileSync("data.json", JSON.stringify(ideas, null, 2));

    res.json({ message: "Comment added" });
});

// =============================
// 🔄 ADD UPDATE (EVOLUTION)
// =============================
app.post("/update/:id", (req, res) => {
    const idea = ideas.find(i => i.id == req.params.id);

    if (!idea) return res.send("Idea not found");

    idea.updates.push(req.body.update);

    fs.writeFileSync("data.json", JSON.stringify(ideas, null, 2));

    res.json({ message: "Update added" });
});

// =============================
// 🔍 SEARCH
// =============================
app.get("/search", (req, res) => {
    const q = req.query.q.toLowerCase();

    const filtered = ideas.filter(i =>
        i.title.toLowerCase().includes(q)
    );

    res.json(filtered);
});

// =============================
// 🚀 START SERVER
// =============================
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
