const socket = io();

let myName = "";
let profilePic = "";

// REGISTER
async function register() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch("/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    alert(data.success ? "Registered!" : "User exists");
}

// LOGIN
async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const file = document.getElementById("profilePic").files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            profilePic = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    const res = await fetch("/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.success) {
        myName = username;

        document.getElementById("auth").style.display = "none";
        document.getElementById("chatUI").style.display = "block";

        document.getElementById("welcome").innerText = "Welcome " + myName;
    } else {
        alert("Invalid login");
    }
}

// LOAD MESSAGES
socket.on("loadMessages", (msgs) => {
    const chat = document.getElementById("chat");
    chat.innerHTML = "";
    msgs.forEach(addMessage);
});

// NEW MESSAGE
socket.on("newMessage", (msg) => {
    addMessage(msg);
});

// SEND MESSAGE / IMAGE
function sendMessage() {
    const input = document.getElementById("message");
    const file = document.getElementById("imageInput").files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            socket.emit("sendMessage", {
                name: myName,
                image: e.target.result,
                pic: profilePic
            });
        };
        reader.readAsDataURL(file);
        return;
    }

    const message = input.value;
    if (!message) return;

    socket.emit("sendMessage", {
        name: myName,
        message,
        pic: profilePic
    });

    input.value = "";
}

// DISPLAY MESSAGE
function addMessage(msg) {
    const chat = document.getElementById("chat");

    const div = document.createElement("div");
    div.classList.add("message");

    if (msg.audio) {
        div.innerHTML = `
            <img src="${msg.pic || ''}" width="30" style="border-radius:50%">
            <b>${msg.name}:</b><br>
            <audio controls src="${msg.audio}"></audio>
        `;
    } else if (msg.image) {
        div.innerHTML = `
            <img src="${msg.pic || ''}" width="30" style="border-radius:50%">
            <b>${msg.name}:</b><br>
            <img src="${msg.image}" width="150">
        `;
    } else {
        div.innerHTML = `
            <img src="${msg.pic || ''}" width="30" style="border-radius:50%">
            <b>${msg.name}:</b> ${msg.message}
        `;
    }

    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

// ENTER KEY
document.getElementById("message").addEventListener("keypress", function(e) {
    if (e.key === "Enter") sendMessage();
});

// VOICE RECORD
async function recordVoice() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    let chunks = [];

    recorder.ondataavailable = e => chunks.push(e.data);

    recorder.onstop = () => {
        const blob = new Blob(chunks);
        const reader = new FileReader();

        reader.onload = function(e) {
            socket.emit("sendMessage", {
                name: myName,
                audio: e.target.result,
                pic: profilePic
            });
        };

        reader.readAsDataURL(blob);
    };

    recorder.start();
    setTimeout(() => recorder.stop(), 3000);
}
