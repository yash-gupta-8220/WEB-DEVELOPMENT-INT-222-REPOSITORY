const express = require("express");
const app = express();

app.use(express.json());

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

// get ideas
app.get("/ideas", (req, res) => {
  res.json(ideas);
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});;
