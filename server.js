const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.log(err));

// Schema
const IdeaSchema = new mongoose.Schema({
    title: String,
    domain: String,
    content: String,
    history: [{ text: String, date: { type: Date, default: Date.now } }]
});

const Idea = mongoose.model("Idea", IdeaSchema);

// Routes
app.get("/api/ideas", async (req, res) => {
    const ideas = await Idea.find().sort({ _id: -1 });
    res.json(ideas);
});

app.post("/api/ideas", async (req, res) => {
    const { title, domain, content } = req.body;

    const newIdea = new Idea({
        title,
        domain,
        content,
        history: [{ text: content }]
    });

    await newIdea.save();
    res.json(newIdea);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(Server running on port ${PORT});
});
