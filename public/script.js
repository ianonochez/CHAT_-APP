let myName = "";

// ask name once
window.onload = () => {
    myName = prompt("Enter your name:");
    loadMessages();
};

async function loadMessages() {
    const res = await fetch("/messages");
    const data = await res.json();

    const chat = document.getElementById("chat");
    chat.innerHTML = "";

    data.forEach(msg => {
        const div = document.createElement("div");
        div.classList.add("message");

        if (msg.name === myName) {
            div.classList.add("you");
        } else {
            div.classList.add("other");
        }

        div.innerHTML = `<b>${msg.name}:</b> ${msg.message}`;
        chat.appendChild(div);
    });

    // auto scroll down
    chat.scrollTop = chat.scrollHeight;
}

// send message
async function sendMessage() {
    const message = document.getElementById("message").value;

    await fetch("/send", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: myName, message })
    });

    document.getElementById("message").value = "";
    loadMessages();
}

// refresh every 2 sec
setInterval(loadMessages, 2000);
