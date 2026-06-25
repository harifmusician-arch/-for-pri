const socket = io("https://for-pri.onrender.com");

async function loadMessages() {

    const response = await fetch(
        "https://for-pri.onrender.com/messages"
    );

    const data = await response.json();

    messages.innerHTML = "";

    data.forEach(msg => {

        addMessage(
            msg.username,
            msg.message,
            msg.username === username
        );

    });

}

/* ===========================
LOGIN
=========================== */

let username = localStorage.getItem("priUsername");

const loginModal = document.getElementById("loginModal");
const continueBtn = document.getElementById("continueBtn");
const nameInput = document.getElementById("nameInput");

if(username){

    loginModal.style.display = "none";

    loadMessages();

}else {


nameInput.focus();


}

continueBtn.onclick = () => {


username = nameInput.value.trim();

if (!username) return;

localStorage.setItem("priUsername", username);

loginModal.style.display = "none";
loadMessages();


};

nameInput.addEventListener("keypress", e => {


if (e.key === "Enter") {

    continueBtn.click();

}


});

/* ===========================
ELEMENTS
=========================== */

const messages = document.getElementById("messages");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const typingStatus = document.getElementById("typingStatus");
const status = document.getElementById("status");

let typingTimeout;

/* ===========================
TIME
=========================== */

function currentTime() {


return new Date().toLocaleTimeString([], {

    hour: "2-digit",
    minute: "2-digit"

});


}

/* ===========================
ADD MESSAGE
=========================== */

function addMessage(name, text, mine) {


const message = document.createElement("div");

message.className = "message " + (mine ? "me" : "them");

message.innerHTML = `
    <strong>${name}</strong>
    <div>${text}</div>
    <div class="time">${currentTime()}</div>
`;

messages.appendChild(message);

messages.scrollTop = messages.scrollHeight;


}

/* ===========================
SEND MESSAGE
=========================== */

function sendMessage() {


const text = input.value.trim();

if (!text) return;

socket.emit("chat-message", {

    username,
    text

});

input.value = "";


}

sendBtn.onclick = sendMessage;

input.addEventListener("keypress", e => {


socket.emit("typing", username);

if (e.key === "Enter") {

    sendMessage();

}


});

/* ===========================
RECEIVE MESSAGE
=========================== */

socket.on("chat-message", data => {


addMessage(

    data.username,
    data.text,
    data.username === username

);


});

/* ===========================
TYPING
=========================== */

socket.on("typing", name => {


if (name === username) return;

typingStatus.innerText = `${name} is typing...`;

clearTimeout(typingTimeout);

typingTimeout = setTimeout(() => {

    typingStatus.innerText = "";

}, 1000);


});

/* ===========================
ONLINE COUNT
=========================== */

socket.on("online-count", count => {


if (count === 1) {

    status.innerHTML = "🟢 Just you online";

} else {

    status.innerHTML = `🟢 ${count} people online`;

}


});
