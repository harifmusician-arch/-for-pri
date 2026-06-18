const bgMusic = document.getElementById("bgMusic");

window.addEventListener("load", () => {

    if(!bgMusic) return;

    const savedTime =
    localStorage.getItem("songTime");

    if(savedTime){

        bgMusic.currentTime =
        parseFloat(savedTime);
    }

    bgMusic.play().catch(() => {});

});

setInterval(() => {

    if(bgMusic && !bgMusic.paused){

        localStorage.setItem(
            "songTime",
            bgMusic.currentTime
        );
    }

},500);

function toggleMusic(){

    if(!bgMusic) return;

    const btn =
    document.getElementById("musicBtn");

    if(bgMusic.paused){

        bgMusic.play();

        if(btn){
            btn.innerHTML = "🎵";
        }

    }else{

        bgMusic.pause();

        if(btn){
            btn.innerHTML = "🔇";
        }

    }

}