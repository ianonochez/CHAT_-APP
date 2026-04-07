const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// serve frontend
app.use(express.static("public"));

let messages = [];

// socket connection
io.on("connection", (socket) => {
    console.log("User connected");

    // send old messages
    socket.emit("loadMessages", messages);

    // receive new message
    socket.on("sendMessage", (msg) => {
        messages.push(msg);

        // send to everyone
        io.emit("newMessage", msg);
    });
});

// IMPORTANT FOR RENDER 🔥
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
