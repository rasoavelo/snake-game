const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");

const box = 20; // taille d’un carré
let snake = [{ x: 9 * box, y: 10 * box }];
let direction = null;
let nextDirection = null;
let food = {
  x: Math.floor(Math.random() * (canvas.width / box)) * box,
  y: Math.floor(Math.random() * (canvas.height / box)) * box,
};
let score = 0;

// écoute les touches du clavier
document.addEventListener("keydown", directionHandler);

function directionHandler(event) {
  switch (event.key) {
    case "ArrowLeft":
      if (direction !== "RIGHT") nextDirection = "LEFT";
      break;

    case "ArrowUp":
      if (direction !== "DOWN") nextDirection = "UP";
      break;

    case "ArrowRight":
      if (direction !== "LEFT") nextDirection = "RIGHT";
      break;

    case "ArrowDown":
      if (direction !== "UP") nextDirection = "DOWN";
      break;

    default:
      break;
  }
}

// dessiner la grille (plateau)
function drawBoard() {
  for (let y = 0; y < canvas.height / box; y++) {
    for (let x = 0; x < canvas.width / box; x++) {
      ctx.fillStyle = "#aaa"; // couleur de fond du carré
      ctx.fillRect(x * box, y * box, box, box);
      ctx.strokeStyle = "#fff"; // bordure blanche
      ctx.strokeRect(x * box, y * box, box, box);
    }
  }
}

// dessiner le jeu
function drawGame() {
  // mettre à jour la direction seulement une fois par tick
  if (nextDirection) {
    direction = nextDirection;
    nextDirection = null;
  }

  drawBoard();

  // dessiner le serpent
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? "#0f0" : "#0a0";
    ctx.fillRect(segment.x, segment.y, box, box);
    ctx.strokeStyle = "#fff";
    ctx.strokeRect(segment.x, segment.y, box, box);
  });

  // dessiner la nourriture
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);
  ctx.strokeStyle = "#fff";
  ctx.strokeRect(food.x, food.y, box, box);

  // calculer nouvelle tête
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === "LEFT") snakeX -= box;
  if (direction === "UP") snakeY -= box;
  if (direction === "RIGHT") snakeX += box;
  if (direction === "DOWN") snakeY += box;

  // manger la pomme ?
  if (snakeX === food.x && snakeY === food.y) {
    score++;
    scoreDisplay.textContent = "Score : " + score;
    food = {
      x: Math.floor(Math.random() * (canvas.width / box)) * box,
      y: Math.floor(Math.random() * (canvas.height / box)) * box,
    };
  } else {
    snake.pop(); // retirer la queue si pas de nourriture
  }

  const newHead = { x: snakeX, y: snakeY };

  // collisions bord ou corps
  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= canvas.width ||
    snakeY >= canvas.height ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    alert("💀 Game Over ! Score : " + score);
  }

  snake.unshift(newHead); // ajouter la tête
}

// collision avec le corps
function collision(head, array) {
  for (const segment of array) {
    if (head.x === segment.x && head.y === segment.y) return true;
  }
  return false;
}

// boucle du jeu, fixe (le serpent avance toujours un carré par tick)
let game = setInterval(drawGame, 100); // 100 ms = vitesse constante
