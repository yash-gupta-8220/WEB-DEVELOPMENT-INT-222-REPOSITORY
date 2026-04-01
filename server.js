const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ DB Error:", err));

// ✅ Schema
const IdeaSchema = new mongoose.Schema({
  title: String,
  domain: String,
  description: String
});

const Idea = mongoose.model("Idea", IdeaSchema);

// ✅ Serve Frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ✅ Add Idea (SAVE TO MONGODB)
app.post("/add", async (req, res) => {
  try {
    const newIdea = new Idea(req.body);
    await newIdea.save();
    res.send("✅ Idea Added Successfully");
  } catch (err) {
    res.status(500).send("❌ Error saving idea");
  }
});


app.get("/ideas", async (req, res) => {
  try {
    const ideas = await Idea.find();
    res.json(ideas);
  } catch (err) {
    res.status(500).send("❌ Error fetching ideas");
  }
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(🚀 Server running on port ${PORT});
});
