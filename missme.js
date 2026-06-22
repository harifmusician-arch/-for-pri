async function sendAlert(message){

    const webhook =
    "https://discord.com/api/webhooks/1518645891827761265/qC2vc2uWAWGEadbr1hIZHROzGROil0EEk9WmcwYEduR2etGJWjJERloVnsf2okhm2KVj";

    try{

        await fetch(webhook, {

            method: "POST",

            headers: {
                "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

                content: message

            })

        });

        alert("Sent ❤️");

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