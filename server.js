const express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const SECRET = "mysecretkey";

app.use(express.json());
app.use(express.static(__dirname));

let ideas = [];
let users = [];

// Load data
if (fs.existsSync("data.json")) {
    ideas = JSON.parse(fs.readFileSync("data.json"));
}

// Save data
function saveData() {
    fs.writeFileSync("data.json", JSON.stringify(ideas, null, 2));
}

//////////////////////////////////////////////////////
// 🔐 REGISTER
//////////////////////////////////////////////////////
app.post("/register", (req, res) => {
    const { username, password } = req.body;

    const user = {
        id: Date.now().toString(),
        username,
        password
    };

    users.push(user);
    res.json({ message: "Registered successfully" });
});

//////////////////////////////////////////////////////
// 🔐 LOGIN (JWT)
//////////////////////////////////////////////////////
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
        { id: user.id, username: user.username },
        SECRET
    );

    res.json({ token });
});

//////////////////////////////////////////////////////
// 🔐 VERIFY TOKEN
//////////////////////////////////////////////////////
function verifyToken(req, res, next) {
    const token = req.headers["authorization"];

    if (!token) return res.status(403).json({ message: "No token provided" });

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ message: "Invalid token" });
    }
}

//////////////////////////////////////////////////////
// 💡 ADD IDEA
//////////////////////////////////////////////////////
app.post("/add", verifyToken, (req, res) => {
    const newIdea = {
        id: Date.now().toString(),
        title: req.body.title,
        domain: req.body.domain,
        description: req.body.description,
        user: req.user.username,
        comments: [],
        likes: 0,
        collaborators: [],
        versions: [req.body.description],
        createdAt: new Date()
    };

    ideas.push(newIdea);
    saveData();

    io.emit("newIdea", newIdea); // 🔥 real-time update

    res.json({ message: "Idea added" });
});

//////////////////////////////////////////////////////
// 📋 GET IDEAS
//////////////////////////////////////////////////////
app.get("/ideas", (req, res) => {
    res.json(ideas);
});

//////////////////////////////////////////////////////
// 💬 COMMENT
//////////////////////////////////////////////////////
app.post("/ideas/:id/comment", verifyToken, (req, res) => {
    const idea = ideas.find(i => i.id === req.params.id);

    if (!idea) return res.status(404).json({ message: "Idea not found" });

    const newComment = {
        text: req.body.text,
        user: req.user.username,
        time: new Date()
    };

    idea.comments.push(newComment);
    saveData();

    io.emit("newComment", { ideaId: idea.id, comment: newComment }); // 🔥 real-time

    res.json({ message: "Comment added" });
});

//////////////////////////////////////////////////////
// 👍 LIKE
//////////////////////////////////////////////////////
app.put("/ideas/:id/like", (req, res) => {
    const idea = ideas.find(i => i.id === req.params.id);

    if (!idea) return res.status(404).json({ message: "Idea not found" });

    idea.likes += 1;
    saveData();

    io.emit("likeUpdate", { ideaId: idea.id, likes: idea.likes }); // 🔥 real-time

    res.json({ message: "Liked" });
});

//////////////////////////////////////////////////////
// 🤝 COLLABORATE
//////////////////////////////////////////////////////
app.post("/ideas/:id/collaborate", verifyToken, (req, res) => {
    const idea = ideas.find(i => i.id === req.params.id);

    if (!idea) return res.status(404).json({ message: "Idea not found" });

    idea.collaborators.push({
        name: req.user.username,
        status: "requested",
        time: new Date()
    });

    saveData();

    io.emit("collabRequest", { ideaId: idea.id }); // 🔥 real-time

    res.json({ message: "Collaboration requested" });
});

//////////////////////////////////////////////////////
// 🔄 UPDATE IDEA
//////////////////////////////////////////////////////
app.put("/ideas/:id/update", verifyToken, (req, res) => {
    const idea = ideas.find(i => i.id === req.params.id);

    if (!idea) return res.status(404).json({ message: "Idea not found" });

    idea.description = req.body.description;
    idea.versions.push(req.body.description);

    saveData();

    io.emit("ideaUpdated", idea); // 🔥 real-time

    res.json({ message: "Idea updated" });
});

//////////////////////////////////////////////////////
// 🔍 FILTER
//////////////////////////////////////////////////////
app.get("/ideas/domain/:domain", (req, res) => {
    const filtered = ideas.filter(i => i.domain === req.params.domain);
    res.json(filtered);
});

//////////////////////////////////////////////////////
// ⚡ SOCKET CONNECTION
//////////////////////////////////////////////////////
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

//////////////////////////////////////////////////////
// 🚀 START SERVER (Render Ready)
//////////////////////////////////////////////////////
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
