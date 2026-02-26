const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let score = 0;
let gameLoopInterval;

function startGame() {
    snake = [{ x: 10, y: 10 }];
    food = { x: 15, y: 15 };
    dx = 0;
    dy = 0;
    score = 0;
    scoreElement.innerText = score;
    
    if (gameLoopInterval) clearInterval(gameLoopInterval);
    gameLoopInterval = setInterval(gameLoop, 100);
}

function gameLoop() {
    update();
    draw();
}

function update() {
    // Bewege die Schlange nur, wenn eine Taste gedrückt wurde
    if (dx === 0 && dy === 0) return; 

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    
    // Wand-Kollision (Game Over)
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return gameOver();
    }

    // Selbst-Kollision (Game Over)
    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return gameOver();
        }
    }

    snake.unshift(head);

    // Essen aufgesammelt
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.innerText = score;
        placeFood();
    } else {
        snake.pop(); // Schwanz entfernen, wenn nicht gegessen wurde
    }
}

function draw() {
    // Canvas leeren
    ctx.fillStyle = "#34495e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Essen zeichnen
    ctx.fillStyle = "#e74c3c";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

    // Schlange zeichnen
    ctx.fillStyle = "#2ecc71";
    snake.forEach((part, index) => {
        // Kopf minimal dunkler färben
        if (index === 0) ctx.fillStyle = "#27ae60"; 
        else ctx.fillStyle = "#2ecc71";
        
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

function placeFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
    // Verhindern, dass Essen auf der Schlange spawnt
    for (let part of snake) {
        if (part.x === food.x && part.y === food.y) {
            placeFood();
            break;
        }
    }
}

function gameOver() {
    clearInterval(gameLoopInterval);
    alert("Game Over! Punktzahl: " + score + "\\nKlicke OK, um neu zu starten.");
    startGame();
}

document.addEventListener("keydown", event => {
    switch (event.key) {
        case "ArrowUp":
            if (dy !== 1) { dx = 0; dy = -1; }
            break;
        case "ArrowDown":
            if (dy !== -1) { dx = 0; dy = 1; }
            break;
        case "ArrowLeft":
            if (dx !== 1) { dx = -1; dy = 0; }
            break;
        case "ArrowRight":
            if (dx !== -1) { dx = 1; dy = 0; }
            break;
    }
});

startGame();
