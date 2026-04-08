const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let messages = [];

// when user connects
io.on("connection", (socket) => {
    console.log("User connected");

    // send old messages
    socket.emit("loadMessages", messages);

    // receive message
    socket.on("sendMessage", (msg) => {
        messages.push(msg);

        // send to everyone instantly
        io.emit("newMessage", msg);
    });
});

server.listen(3000, () => console.log("Running on http://localhost:3000"));
