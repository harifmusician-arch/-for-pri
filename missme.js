async function sendAlert(message){

    const webhook = "https://discord.com/api/webhooks/1518645891827761265/qC2vc2uWAWGEadbr1hIZHROzGROil0EEk9WmcwYEduR2etGJWjJERloVnsf2okhm2KVj";

    const buttons =
    document.querySelectorAll(
        ".miss-me-btn"
    );

    buttons.forEach(btn => {

        btn.disabled = true;

        btn.style.opacity = ".5";

    });

    try{

        await fetch(webhook, {

            method: "POST",

            headers: {
                "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

                content:
                `📡 PRI SIGNAL RECEIVED

${message}

🕒 ${new Date().toLocaleTimeString()}`

            })

        });

        alert(
            "Signal sent ❤️\nTry again in 60 seconds."
        );

    }

    catch(error){

        alert("Failed 😭");

        console.error(error);

    }

    setTimeout(() => {

        buttons.forEach(btn => {

            btn.disabled = false;

            btn.style.opacity = "1";

        });

    }, 60000);

}