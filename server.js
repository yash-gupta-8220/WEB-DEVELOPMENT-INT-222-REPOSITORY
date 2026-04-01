const express = require("express");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Submit idea (WORKING VERSION)
app.post("/add", (req, res) => {
    const idea = req.body;
    console.log("Received Idea:", idea);

    res.send("Idea Added Successfully");
});

// Port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
