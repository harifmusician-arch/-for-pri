const PASSWORD = "only4us";

const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const error = document.getElementById("error");

loginBtn.onclick = () => {

    const enteredPassword = passwordInput.value.trim();

    if (enteredPassword === PASSWORD) {

        localStorage.setItem("loggedIn", "true");

        window.location.href = "chat.html";

    } else {

        error.innerText = "❌ Wrong Password";

    }

};

passwordInput.addEventListener("keypress", e => {

    if (e.key === "Enter") {

        loginBtn.click();

    }

});