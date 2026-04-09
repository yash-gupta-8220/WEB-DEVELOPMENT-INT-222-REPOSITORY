const express = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(express.json());
app.use(express.static(__dirname)); // serve frontend

let ideas = [];

// Load existing data
if (fs.existsSync("data.json")) {
    ideas = JSON.parse(fs.readFileSync("data.json"));
}

// Save function
function saveData() {
    fs.writeFileSync("data.json", JSON.stringify(ideas, null, 2));
}

//////////////////////////////////////////////////////
// ✅ ADD IDEA
//////////////////////////////////////////////////////
app.post("/add", (req, res) => {
    const newIdea = {
        id: uuidv4(),
        title: req.body.title,
        domain: req.body.domain,
        description: req.body.description,
        comments: [],
        likes: 0,
        collaborators: [],
        versions: [req.body.description],
        createdAt: new Date()
    };

    ideas.push(newIdea);
    saveData();

    res.json({ message: "Idea saved successfully" });
});

//////////////////////////////////////////////////////
// ✅ GET ALL IDEAS
//////////////////////////////////////////////////////
app.get("/ideas", (req, res) => {
    res.json(ideas);
});

//////////////////////////////////////////////////////
// ✅ ADD COMMENT
//////////////////////////////////////////////////////
app.post("/ideas/:id/comment", (req, res) => {
    const idea = ideas.find(i => i.id === req.params.id);

    if (!idea) {
        return res.status(404).json({ message: "Idea not found" });
    }

    idea.comments.push({
        text: req.body.text,
        time: new Date()
    });

    saveData();

    res.json({ message: "Comment added" });
});

//////////////////////////////////////////////////////
// ✅ LIKE IDEA
//////////////////////////////////////////////////////
app.put("/ideas/:id/like", (req, res) => {
    const idea = ideas.find(i => i.id === req.params.id);

    if (!idea) {
        return res.status(404).json({ message: "Idea not found" });
    }

    idea.likes += 1;

    saveData();

    res.json({ message: "Liked successfully" });
});

//////////////////////////////////////////////////////
// ✅ COLLABORATION REQUEST
//////////////////////////////////////////////////////
app.post("/ideas/:id/collaborate", (req, res) => {
    const idea = ideas.find(i => i.id === req.params.id);

    if (!idea) {
        return res.status(404).json({ message: "Idea not found" });
    }

    idea.collaborators.push({
        name: req.body.name || "Anonymous",
        status: "requested",
        time: new Date()
    });

    saveData();

    res.json({ message: "Collaboration request sent" });
});

//////////////////////////////////////////////////////
// ✅ UPDATE IDEA (EVOLUTION TRACKING)
//////////////////////////////////////////////////////
app.put("/ideas/:id/update", (req, res) => {
    const idea = ideas.find(i => i.id === req.params.id);

    if (!idea) {
        return res.status(404).json({ message: "Idea not found" });
    }

    idea.description = req.body.description;
    idea.versions.push(req.body.description);

    saveData();

    res.json({ message: "Idea updated successfully" });
});

//////////////////////////////////////////////////////
// ✅ FILTER BY DOMAIN
//////////////////////////////////////////////////////
app.get("/ideas/domain/:domain", (req, res) => {
    const filtered = ideas.filter(i => i.domain === req.params.domain);
    res.json(filtered);
});

/////////////////////////////////////////////////////
//////////////////////////////////////////////////////
app.delete("/ideas/:id", (req, res) => {
    ideas = ideas.filter(i => i.id !== req.params.id);

    saveData();

    res.json({ message: "Idea deleted successfully" });
});

//////////////////////////////////////////////////////

//////////////////////////////////////////////////////
const PORT = 3000;
app.listen(PORT, () => {
    console.log(Server running on port ${PORT});
});
