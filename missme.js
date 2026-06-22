async function sendAlert(message){

    const webhook =
    "https://discord.com/api/webhooks/1518645891827761265/qC2vc2uWAWGEadbr1hIZHROzGROil0EEk9WmcwYEduR2etGJWjJERloVnsf2okhm2KVj";

    const buttons =
    document.querySelectorAll(
        ".miss-me-btn"
    );

    buttons.forEach(btn => {

        btn.disabled = true;

        btn.style.opacity = ".5";

    });

    const timestamp =
    new Date().toLocaleString();

    try{

        /* DISCORD */

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

🕒 ${timestamp}`

            })

        });

        /* EMAILJS */

        emailjs.send(

            "service_l6qtx8d",

            "template_222pmul",

            {

                message: message,

                time: timestamp

            },

            "BV3rYptmtpkEYxR6P"

        );

        alert(
            "Signal sent ❤️\nTry again in 60 seconds."
        );

    }

    catch(error){

        alert("Failed 😭");

        console.error(error);

    }

    

}

function toggleSignals(){

    const menu =
    document.getElementById(
        "signalButtons"
    );

    menu.classList.toggle(
        "show-signals"
    );

}