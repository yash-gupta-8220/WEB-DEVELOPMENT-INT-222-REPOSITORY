const express = require("express");
const app = express();


const http = require("http").createServer(app);
const io = require("socket.io")(http);

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔥 serve frontend
app.use(express.static("public"));

let ideas = [];


app.get("/ideas", (req, res) => {
  res.json(ideas);
});

app.post("/add", (req, res) => {
  const idea = req.body;
  ideas.push(idea);

  // 🔥 send to all users instantly
  io.emit("newIdea", idea);

  res.send("Idea Added");
});

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("chatMessage", (msg) => {
    io.emit("chatMessage", msg); // broadcast
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

//
http.listen(process.env.PORT || 3000, () => {
  console.log("Server running...");
});
