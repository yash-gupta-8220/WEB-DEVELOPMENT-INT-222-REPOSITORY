const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

let ideas = [];

// open website
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// add idea
app.post("/add", (req, res) => {
    ideas.push(req.body);
    res.send("Idea Added");
});

// get ideas
app.get("/ideas", (req, res) => {
    res.json(ideas);
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
