[1:11 PM, 3/6/2026] Mummy: body{
    font-family: Arial;
    margin:0;
    padding:0;
    background:#f4f4f4;
}

/* Header */
header{
    background:#2c7be5;
    color:white;
    text-align:center;
    padding:20px;
}

/* Introduction section */
.intro{
    width:80%;
    margin:20px auto;
    padding:15px;
}

/* Title */
.title{
    text-align:center;
}

/* Destination section */
.destinations{
    display:flex;
    justify-content:center;
    gap:20px;
    margin:20px;
}

/* Card design */
.card{
    background:white;
    padding:10px;
    border-radius:10px;
    text-align:center;
}

/* Images */
.card img{
    width:250px;
    border-radius:10px;
}

/* Table styling */
table{
    width:80%;
    margin:30px auto;
    border-collapse:collapse;
}

th, td{
    padding:10px;
    border…
[1:20 PM, 3/6/2026] Mummy: body{
    font-family: Arial;
    margin:0;
    padding:0;
    background:#f4f4f4;
}

/* Header */
header{
    background:#2c7be5;
    color:white;
    text-align:center;
    padding:20px;
}

/* Introduction section */
.intro{
    width:80%;
    margin:20px auto;
    padding:15px;
}

/* Title */
.title{
    text-align:center;
}

/* Destination section */
.destinations{
    display:flex;
    justify-content:center;
    gap:20px;
    margin:20px;
}

/* Card design */
.card{
    background:white;
    padding:10px;
    border-radius:10px;
    text-align:center;
}

/* Images */
.card img{
    width:250px;
    border-radius:10px;
}

/* Table styling */
table{
    width:80%;
    margin:30px auto;
    border-collapse:collapse;
}

th, td{
    padding:10px;
    border…
[8:59 PM, 3/30/2026] YASH: https://web-development-int-222-repository.onrender.com/
[8:51 PM, 3/31/2026] YASH: const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// MongoDB connect
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Schema
const ideaSchema = new mongoose.Schema({
  title: String,
  domain: String,
  description: String
});

const Idea = mongoose.model("Idea", ideaSchema);

// Add idea
app.post("/add", async (req, res) => {
  const newIdea = new Idea(req.body);
  await newIdea.save();
  res.send("Idea saved");
});

// Get ideas
app.get("/ideas", async (req, res) => {
  const ideas = await Idea.find();
  res.json(ideas);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
