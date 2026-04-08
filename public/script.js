cat <<'EOF' > public/script.js
let myName = "";

window.onload = () => {
    myName = prompt("Enter your name:") || "Guest";
    loadMessages();
};

async function loadMessages() {
    try {
        const res = await fetch("/messages");
        const data = await res.json();
        const chat = document.getElementById("chat");
        
        chat.innerHTML = "";

        data.forEach(msg => {
            const wrapper = document.createElement("div");
            wrapper.classList.add("message-wrapper");
            
            const div = document.createElement("div");
            div.classList.add("message");

            if (msg.name === myName) {
                wrapper.classList.add("you-wrapper");
                div.classList.add("you");
            } else {
                wrapper.classList.add("other-wrapper");
                div.classList.add("other");
            }

            div.innerHTML = `<small>${msg.name}</small><p>${msg.message}</p>`;
            wrapper.appendChild(div);
            chat.appendChild(wrapper);
        });

        chat.scrollTop = chat.scrollHeight;
    } catch (err) {
        console.error("Error loading messages:", err);
    }
}

async function sendMessage() {
    const messageInput = document.getElementById("message");
    const message = messageInput.value.trim();
    if (!message) return;

    try {
        await fetch("/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: myName, message })
        });
        messageInput.value = "";
        loadMessages();
    } catch (err) {
        console.error("Error sending message:", err);
    }
}

setInterval(loadMessages, 2000);
EOF
}
