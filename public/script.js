let myName = "";

// ask name once
window.onload = () => {
    myName = prompt("Enter your name:") || "Anonymous"; // Fallback if they hit cancel
    loadMessages();
};

async function loadMessages() {
    const res = await fetch("/messages");
    const data = await res.json();

    const chat = document.getElementById("chat");
    chat.innerHTML = "";

    data.forEach(msg => {
        // 1. Create a wrapper to handle the "push" to the left or right
        const wrapper = document.createElement("div");
        wrapper.classList.add("message-wrapper");

        // 2. Create the actual bubble
        const div = document.createElement("div");
        div.classList.add("message");

        if (msg.name === myName) {
            wrapper.classList.add("you-wrapper"); // Pushes to right
            div.classList.add("you");            // Colors it green
        } else {
            wrapper.classList.add("other-wrapper"); // Pushes to left
            div.classList.add("other");             // Colors it grey
        }

        div.innerHTML = `<small>${msg.name}</small><p>${msg.message}</p>`;
        
        wrapper.appendChild(div);
        chat.appendChild(wrapper);
    });

    chat.scrollTop = chat.scrollHeight;
}

async function sendMessage() {
    const messageInput = document.getElementById("message");
    const message = messageInput.value.trim();

    if (!message) return; // Don't send empty messages

    await fetch("/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: myName, message })
    });

    messageInput.value = "";
    loadMessages();
}

setInterval(loadMessages, 2000);
}
