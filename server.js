const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let messages = [];

// load saved messages
if (fs.existsSync("messages.json")) {
    messages = JSON.parse(fs.readFileSync("messages.json"));
}

io.on("connection", (socket) => {
    socket.emit("loadMessages", messages);

    socket.on("sendMessage", (msg) => {
        messages.push(msg);

        // save to file
        fs.writeFileSync("messages.json", JSON.stringify(messages));

        io.emit("newMessage", msg);
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
