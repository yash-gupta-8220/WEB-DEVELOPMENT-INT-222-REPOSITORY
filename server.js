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

app.put("/update/:index", (req, res) => {
    const index = req.params.index;

    if (index >= 0 && index < ideas.length) {
        ideas[index] = req.body;

        // Save updated data to file
        fs.writeFileSync("data.json", JSON.stringify(ideas, null, 2));

        res.json({ message: "Idea updated successfully" });
    } else {
        res.status(404).json({ message: "Idea not found" });
    }
});


app.get("/ideas", (req, res) => {
  res.json(ideas);
});


app.listen(3000, () => {
  console.log("Server running on port 3000");
});
