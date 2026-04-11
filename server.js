const express = require("express");
const fs = require("fs");
const { createToken, verifyToken } = require("./jwt");
const app = express();

app.use(express.json());
app.use(express.static(__dirname)); // serve frontend


let ideas = [];

if (fs.existsSync("data.json")) {
  ideas = JSON.parse(fs.readFileSync("data.json"));
}
let users = [];

if (fs.existsSync("users.json")) {
    users = JSON.parse(fs.readFileSync("users.json"));
}

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        const token = createToken(user);
        res.json({ token });
    } else {
        res.status(401).json({ message: "Login failed" });
    }
});

app.post("/add", verifyToken, (req, res) => {
    ideas.push(req.body);

    fs.writeFileSync("data.json", JSON.stringify(ideas, null, 2));

    res.json({
        message: "Idea saved successfully",
        user: req.user   // 👈 shows decoded user
    });
});


app.get("/ideas", (req, res) => {
  res.json(ideas);
});


app.listen(3000, () => {
  console.log("Server running on port 3000");
});
