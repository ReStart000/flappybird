const bird = document.getElementById('bird');
const scoredisplay = document.getElementById('score');
const gameoverscreen = document.getElementById('game-over');
const retrybutton = document.querySelector('.retry-button');
const instructions = document.getElementById('instructions');
const startbutton = document.getElementById('start');

const flapsound = document.getElementById('flap-sound');
const diesound = document.getElementById('die-sound');
const hitsound = document.getElementById('hit-sound');
const pointsound = document.getElementById('point-sound');
const swooshsound = document.getElementById('swoosh-sound');

let birdTop = 250;
let birdLeft = 50;
let gravity = 2;
let gameSpeed = 2;
let score = 0;
let isGameOver = false;
let pipepassed = false;

const pipes = document.querySelectorAll('.pipe');

function initializeGame() {
    instructions.style.display = "none";
    swooshsound.play();
    birdTop = 250;
    score = 0;
    scoredisplay.innerText = `Score: ${score}`;
    isGameOver = false;
    pipes.forEach(pipe => {
        pipe.style.left = `${parseInt(pipe.style.left) + 500}px`;
    });
    gameLoop();
}

function jump() {
    if (!isGameOver) {
        birdTop -= 50;
        bird.style.top = birdTop + "px";
        flapsound.play();
    }
}

function resetGame() {
    gameoverscreen.style.display = "none";
    initializeGame();
}

function applyGravity() {
    if (!isGameOver) {
        birdTop += gravity;
        bird.style.top = birdTop + "px";
    }
}

function movePipes() {
    pipes.forEach(pipe => {
        let pipeLeft = parseInt(pipe.style.left);
        if (pipeLeft > -60) {
            pipe.style.left = (pipeLeft - gameSpeed) + "px";
        } else {
            pipe.style.left = "1000px";
        }
    });
}

function detectCollision() {
    pipes.forEach(pipe => {
        let pipeLeft = parseInt(pipe.style.left);
        if (
            birdLeft + 40 > pipeLeft &&
            birdLeft < pipeLeft + 60 &&
            birdTop + 40 > parseInt(pipe.style.top) &&
            birdTop < parseInt(pipe.style.top) + parseInt(pipe.style.height)
        ) {
            hitsound.play();
            gameOver();
        }
    });

    if (birdTop <= 0 || birdTop >= 560) {
        gameOver();
    }
}

function gameOver() {
    isGameOver = true;
    gameoverscreen.style.display = "block";
    diesound.play();
}

function gameLoop() {
    if (isGameOver) {
        return;
    }
    applyGravity();
    movePipes();
    detectCollision();

    pipes.forEach(pipe => {
        let pipeLeft = parseInt(pipe.style.left);
        if (pipeLeft + 60 < birdLeft && !pipepassed) {
            score++;
            pointsound.play();
            scoredisplay.innerText = `Score: ${score}`;
            pipepassed = true;
        }

        if (pipeLeft + 60 >= birdLeft) {
            pipepassed = false;
        }
    });

    requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
    if (e.code === 'Space') {
        jump();
    }
});
retrybutton.addEventListener("click", resetGame);
startbutton.addEventListener("click", initializeGame);
