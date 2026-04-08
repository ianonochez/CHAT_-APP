
async function loadMessages() {
    try {
        const res = await fetch("/messages");
        const data = await res.json();
        const chat = document.getElementById("chat");
        const myName = document.getElementById("name").value || "Guest";
        
        chat.innerHTML = "";

        data.forEach(msg => {
            const wrapper = document.createElement("div");
            wrapper.className = "message-wrapper " + (msg.name === myName ? "you-wrapper" : "other-wrapper");
            
            const div = document.createElement("div");
            div.className = "message " + (msg.name === myName ? "you" : "other");

            div.innerHTML = "<small>" + msg.name + "</small><p>" + msg.message + "</p>";
            wrapper.appendChild(div);
            chat.appendChild(wrapper);
        });

        chat.scrollTop = chat.scrollHeight;
    } catch (err) {
        console.log("Fetch error:", err);
    }
}

async function sendMessage() {
    const nameInput = document.getElementById("name");
    const messageInput = document.getElementById("message");
    const name = nameInput.value || "Guest";
    const message = messageInput.value.trim();

    if (!message) return;

    await fetch("/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name, message: message })
    });

    messageInput.value = "";
    loadMessages();
}

setInterval(loadMessages, 2000);


