const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use(express.static(__dirname)); // serve frontend


let ideas = [];

if (fs.existsSync("data.json")) {
  ideas = JSON.parse(fs.readFileSync("data.json"));
}


app.post("/add", (req, res) => {
  ideas.push(req.body);

  // SAVE TO FILE
  fs.writeFileSync("data.json", JSON.stringify(ideas, null, 2));

  res.json({ message: "Idea saved successfully" });
});


app.get("/ideas", (req, res) => {
  res.json(ideas);
});

app.get("/status", (req, res) => {
    res.json({
        status: "Server is running",
        time: new Date().toLocaleString()
    });
});

app.get("/ideas/:domain", (req, res) => {
    const domain = req.params.domain.toLowerCase();

    const filteredIdeas = ideas.filter(i =>
        i.domain.toLowerCase() === domain
    );

    res.json(filteredIdeas);
});


app.listen(3000, () => {
  console.log("Server running on port 3000");
});
