alert("chat.js loaded");

if(localStorage.getItem("loggedIn") !== "true"){

    window.location.href = "login.html";

}

const socket = io("https://for-pri.onrender.com");

/* ===========================
ELEMENTS
=========================== */

const messages = document.getElementById("messages");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const imageBtn = document.getElementById("imageBtn");
const imageInput = document.getElementById("imageInput");
console.log("imageBtn =", imageBtn);
console.log("imageInput =", imageInput);
const typingStatus = document.getElementById("typingStatus");
const status = document.getElementById("status");

imageBtn.onclick = () => {

    console.log("📷 Camera clicked");

    imageInput.click();

};
let typingTimeout;


async function loadMessages() {

    const response = await fetch(
        "https://for-pri.onrender.com/messages"
    );

    const data = await response.json();

    messages.innerHTML = "";

    data.forEach(msg => {

        if (
            msg.message &&
            msg.message.startsWith("https://res.cloudinary.com")
        ) {

            addImage(
                msg.username,
                msg.message,
                msg.username === username
            );

        } else {

            addMessage(
                msg.username,
                msg.message,
                msg.username === username
            );

        }

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

    if (data.image) {

        addImage(
            data.username,
            data.image,
            data.username === username
        );

    } else {

        addMessage(
            data.username,
            data.text,
            data.username === username
        );

    }

});

function addImage(name, imageUrl, mine) {

    const message = document.createElement("div");

    message.className = "message " + (mine ? "me" : "them");

    message.innerHTML = `
        <strong>${name}</strong>
        <div>
            <img
                src="${imageUrl}"
                class="chat-image"
                style="max-width:250px;border-radius:12px;margin-top:8px;max-height:300px;">
        </div>
        <div class="time">${currentTime()}</div>
    `;

    messages.appendChild(message);

    messages.scrollTop = messages.scrollHeight;

}
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



imageInput.addEventListener("change", async () => {

    alert("Image selected!");

    const file = imageInput.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", "prichat");

    try {

        const response = await fetch(
            "https://api.cloudinary.com/v1_1/dxwjqna0m/image/upload",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        alert("Upload finished!");

        console.log(data);
        socket.emit("chat-message", {

    username,

    image: data.secure_url

});

    } catch (err) {

        alert("Upload failed!");

        console.error(err);

    }

});