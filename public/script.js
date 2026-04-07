const socket = io();
let myName = "";

// ask name
window.onload = () => {
    myName = prompt("Enter your name:");
};

// load old messages
socket.on("loadMessages", (msgs) => {
    const chat = document.getElementById("chat");
    chat.innerHTML = "";

    msgs.forEach(addMessage);
});

// receive new message instantly
socket.on("newMessage", (msg) => {
    addMessage(msg);
});

// send message
function sendMessage() {
    const message = document.getElementById("message").value;

    socket.emit("sendMessage", {
        name: myName,
        message
    });

    document.getElementById("message").value = "";
}

// add message to UI
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
