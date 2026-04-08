const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static("public"));

let users = [];
let messages = [];

// load users
if (fs.existsSync("users.json")) {
    users = JSON.parse(fs.readFileSync("users.json"));
}

// load messages
if (fs.existsSync("messages.json")) {
    messages = JSON.parse(fs.readFileSync("messages.json"));
}

// REGISTER
app.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (users.find(u => u.username === username)) {
        return res.json({ success: false });
    }

    users.push({ username, password });
    fs.writeFileSync("users.json", JSON.stringify(users));

    res.json({ success: true });
});

// LOGIN
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);

    res.json({ success: !!user });
});

// SOCKET CHAT
io.on("connection", (socket) => {
    socket.emit("loadMessages", messages);

    socket.on("sendMessage", (msg) => {
        messages.push(msg);
        fs.writeFileSync("messages.json", JSON.stringify(messages));
        io.emit("newMessage", msg);
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
