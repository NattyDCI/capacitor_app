let timer = 10;
let running = false;
let paused = false;
let lastTime = 0;

let cubeSize = 100;
let cubeY = 0;
let angleX = -Math.PI / 6;
let angleY = 0;
let angleZ = 0;
let fadeOut = false;

let soundEffect;
let soundPlayed = false;
let fadeStart = 0;

let orbitronFont;

function preload() {
    soundEffect = loadSound('assets/short-sound.mp3');
    orbitronFont = loadFont('assets/fonts/Orbitron-Regular.ttf');
}

function setup() {
    let cnv = createCanvas(400, 400, WEBGL);
    cnv.parent('p5-container');
  

    fill(255);

    document.getElementById('startBtn').addEventListener('click', () => {
        if (!running && !fadeOut && timer === 10) {
            // Inicio normal
            startPomodoro();
        } else if (running) {
            // Pausar / reanudar
            paused = !paused;
            document.getElementById('startBtn').innerText = paused ? 'Reanudar' : 'Pausa';
        } else if (!running && timer <= 0) {
            // Reiniciar tras finalizar
            resetPomodoro();
        }
    });
}

function draw() {
    background(18);
    ambientLight(80);
    directionalLight(200, 200, 200, 0, -1, 0);

    // Timer regresivo
    if (running && !paused) {
        let currentMillis = millis();
        if (currentMillis - lastTime >= 1000) {
            timer--;
            lastTime = currentMillis;
        }
    }

    // Cubo
    push();
    cubeY = (running && !paused) ? sin(millis() * 0.002) * 50 : 0;
    translate(0, cubeY, 0);
    rotateX(angleX);
    if (running && !paused) angleY += 0.03;
    rotateY(angleY);
    rotateZ(angleZ);
    box(cubeSize);
    pop();

    // Timer debajo del cubo
    push();
    resetMatrix(); // resetea todas las transformaciones 3D
    translate(0, height / 4, 0); // altura dinámica: debajo del cubo
    textFont(orbitronFont);
    textSize(64);
    fill(255);
    textAlign(CENTER, CENTER);
    text(timer > 0 ? timer : 0, 0, 0);
    pop();

    // Sonido y fade out
    if (timer <= 0 && running && !soundPlayed) {
        soundEffect.play();
        soundPlayed = true;
        running = false;
        fadeOut = true;
        fadeStart = millis();
        document.getElementById('startBtn').innerText = 'Start';
    }

    // Fade out cubo
    if (fadeOut) {
        let elapsed = millis() - fadeStart;
        if (elapsed < 2000) cubeSize = 100 * map(elapsed, 0, 2000, 1, 0);
        else cubeSize = 0, fadeOut = false;
    }

    // Rotación Z lenta inicial si no ha empezado
    if (!running && !fadeOut && !paused && timer === 10) angleZ += 0.01;
}

// Función para iniciar el pomodoro
function startPomodoro() {
    running = true;
    paused = false;
    lastTime = millis();
    fadeOut = false;
    cubeSize = 100;
    angleY = 0;
    soundPlayed = false;
    document.getElementById('startBtn').innerText = 'Pausa';
}

// Función para reiniciar todo después de terminar
function resetPomodoro() {
    timer = 10;
    running = false;
    paused = false;
    cubeSize = 100;
    angleX = -Math.PI / 6;
    angleY = 0;
    angleZ = 0;
    fadeOut = false;
    soundPlayed = false;
    document.getElementById('startBtn').innerText = 'Start';
}
