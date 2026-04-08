const socket = io();

// get or save username
let myName = localStorage.getItem("name");

if (!myName) {
    myName = prompt("Enter your name:");
    localStorage.setItem("name", myName);
}

// load old messages
socket.on("loadMessages", (msgs) => {
    const chat = document.getElementById("chat");
    chat.innerHTML = "";
    msgs.forEach(addMessage);
});

// receive new message
socket.on("newMessage", (msg) => {
    addMessage(msg);
});

// send message
function sendMessage() {
    const input = document.getElementById("message");
    const message = input.value;

    if (message.trim() === "") return;

    socket.emit("sendMessage", {
        name: myName,
        message
    });

    input.value = "";
}

// display message
function addMessage(msg) {
    const chat = document.getElementById("chat");

    const div = document.createElement("div");
    div.classList.add("message");

    if (msg.name === myName) {
        div.classList.add("you");
    } else {
        div.classList.add("other");
    }

    div.innerHTML = `<b>${msg.name}:</b> ${msg.message}`;
    chat.appendChild(div);

    chat.scrollTop = chat.scrollHeight;
}
