const petScene = document.getElementById("petScene");

const happiness = document.getElementById("happy");
const hunger = document.getElementById("hunger");
const energy = document.getElementById("energy");

const feedBtn = document.getElementById("feedBtn");
const petBtn = document.getElementById("petBtn");
const playBtn = document.getElementById("playBtn");

/* ===========================
THREE.JS
=========================== */

const scene = new THREE.Scene();
const mouse = {

    x: 0,

    y: 0

};
let blink = 1;
let blinkTimer = 0;
scene.background = new THREE.Color(0x87CEEB);

const camera = new THREE.PerspectiveCamera(
    45,
    900 / 500,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(900, 500);
renderer.shadowMap.enabled = true;

petScene.appendChild(renderer.domElement);

/* ===========================
CAMERA
=========================== */

camera.position.set(6,4,8);
camera.lookAt(0,1,0);

/* ===========================
LIGHTS
=========================== */

const sun = new THREE.DirectionalLight(0xffffff, 3);

sun.position.set(10, 15, 5);
sun.castShadow = true;

scene.add(sun);

scene.add(
    new THREE.AmbientLight(
        0xffffff,
        1.2
    )
);

/* ===========================
GROUND
=========================== */

const ground = new THREE.Mesh(

    new THREE.PlaneGeometry(40, 40),

    new THREE.MeshStandardMaterial({

        color: 0x63c74d

    })

);

ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;

scene.add(ground);

/* ===========================
SUN
=========================== */

const sunSphere = new THREE.Mesh(

    new THREE.SphereGeometry(1, 32, 32),

    new THREE.MeshBasicMaterial({

        color: 0xffeb3b

    })

);

sunSphere.position.set(-12, 12, -15);

scene.add(sunSphere);

/* ===========================
CAT
=========================== */

const cat = new THREE.Group();

/* BODY */

const body = new THREE.Mesh(

    new THREE.BoxGeometry(2, 1.1, 1),

    new THREE.MeshStandardMaterial({

        color: 0xffb74d

    })

);

body.position.y = 0.6;
body.castShadow = true;

cat.add(body);

/* ===========================
HEAD
=========================== */

const head = new THREE.Mesh(

    new THREE.SphereGeometry(0.6, 32, 32),

    new THREE.MeshStandardMaterial({

        color: 0xffc680

    })

);

head.position.set(

    1.15,

    1,

    0

);

head.castShadow = true;

cat.add(head);

/* ===========================
LEFT EAR
=========================== */

const leftEar = new THREE.Mesh(

    new THREE.ConeGeometry(0.18,0.35,4),

    new THREE.MeshStandardMaterial({

        color:0xffb74d

    })

);

leftEar.position.set(

    1.0,

    1.55,

    -0.18

);

leftEar.rotation.z = -0.2;

cat.add(leftEar);

/* ===========================
RIGHT EAR
=========================== */

const rightEar = leftEar.clone();

rightEar.position.z = 0.18;

cat.add(rightEar);

/* ===========================
LEFT EYE
=========================== */

const leftEye = new THREE.Mesh(

    new THREE.SphereGeometry(0.08,16,16),

    new THREE.MeshBasicMaterial({

        color:0x000000

    })

);

leftEye.position.set(

    1.55,

    1.05,

    -0.18

);

cat.add(leftEye);

/* ===========================
RIGHT EYE
=========================== */

const rightEye = leftEye.clone();

rightEye.position.z = 0.18;

cat.add(rightEye);


const eyes = [leftEye, rightEye];
/* ===========================
NOSE
=========================== */

const nose = new THREE.Mesh(

    new THREE.SphereGeometry(0.05,16,16),

    new THREE.MeshBasicMaterial({

        color:0xff69b4

    })

);

nose.position.set(

    1.62,

    0.9,

    0

);

cat.add(nose);

/* ===========================
TAIL
=========================== */

const tail = new THREE.Mesh(

    new THREE.CylinderGeometry(
        0.06,
        0.06,
        1.2,
        8
    ),

    new THREE.MeshStandardMaterial({

        color:0xffb74d

    })

);

tail.position.set(

    -1.1,

    1.0,

    0

);

tail.rotation.z = -0.8;

cat.add(tail);

/* ===========================
LEGS
=========================== */



function createLeg(x,z){
    
    const group = new THREE.Group();

    const leg = new THREE.Mesh(

        new THREE.CylinderGeometry(
            0.08,
            0.08,
            0.65,
            12
        ),

        new THREE.MeshStandardMaterial({

            color:0xffb74d

        })

    );

    leg.position.y=0.2;

    group.add(leg);

    const paw = new THREE.Mesh(

        new THREE.SphereGeometry(
            0.11,
            16,
            16
        ),

        new THREE.MeshStandardMaterial({

            color:0xffffff

        })

    );

    paw.position.y=-0.18;

    group.add(paw);

    group.position.set(x,0,z);

    cat.add(group);

    return group;

}

createLeg(0.7,-0.3);
createLeg(0.7,0.3);

createLeg(-0.7,-0.3);
createLeg(-0.7,0.3);



cat.position.set(0,1.2,0);

scene.add(cat);

/* ===========================
BUTTONS
=========================== */

feedBtn.onclick = () => {

    hunger.value = Math.min(hunger.value + 10, 100);
    happiness.value = Math.min(happiness.value + 4, 100);

};

petBtn.onclick = () => {

    happiness.value = Math.min(happiness.value + 8, 100);

};

playBtn.onclick = () => {

    happiness.value = Math.min(happiness.value + 15, 100);
    energy.value = Math.max(energy.value - 10, 0);

};

/* ===========================
STATS
=========================== */

setInterval(() => {

    hunger.value = Math.max(0, hunger.value - 1);
    energy.value = Math.max(0, energy.value - 1);
    happiness.value = Math.max(0, happiness.value - 1);

}, 15000);

/* ===========================
ANIMATION
=========================== */

function animate(){

    requestAnimationFrame(animate);

    const t = Date.now();

    cat.rotation.y += 0.01;

    cat.position.y = 1.2 + Math.sin(t * 0.003) * 0.05;

    body.scale.y = 1 + Math.sin(t*0.003)*0.03;

    head.position.y = 1 + Math.sin(t*0.003)*0.03;

    tail.rotation.y = Math.sin(t*0.004)*0.4;
    tail.rotation.z = -0.8 + Math.sin(t*0.002)*0.15;

    blinkTimer += 0.02;

    if(blinkTimer > 5){

        blink = Math.max(0, blink - 0.2);

    }

    if(blinkTimer > 5.2){

        blink = Math.min(1, blink + 0.2);

        if(blink === 1){

            blinkTimer = 0;

        }

    }

    eyes.forEach(eye => eye.scale.y = blink);
    head.rotation.y += (mouse.x * 0.5 - head.rotation.y) * 0.05;

head.rotation.x += (-mouse.y * 0.3 - head.rotation.x) * 0.05;

    renderer.render(scene,camera);

}
window.addEventListener("mousemove", e => {

    mouse.x = (e.clientX / window.innerWidth - 0.5);

    mouse.y = (e.clientY / window.innerHeight - 0.5);

});
animate();