const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ===== Player Setup =====
let player = {
  x: 400,
  y: 300,
  size: 20,
  speed: 4,
  health: 100,
  alive: true
};

// ===== Enemy Setup =====
let enemies = [];
for (let i = 0; i < 5; i++) {
  enemies.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: 20,
    health: 50,
    alive: true
  });
}

// ===== Bullets =====
let bullets = [];

// ===== Sounds (embedded base64 WAV) =====
const shootSound = new Audio("data:audio/wav;base64,UklGRgAAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQgAAAAA/////wD///8A////AP///wD///8A////AP///w==");
const hitSound   = new Audio("data:audio/wav;base64,UklGRgAAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQgAAAAA////AP///wD///8A////AP///wD///8A////AAAAAA==");

// ===== Controls =====
let keys = {};
document.addEventListener("keydown", (e) => { keys[e.key] = true; });
document.addEventListener("keyup", (e) => { keys[e.key] = false; });

document.addEventListener("click", shoot);

function shoot() {
  if (!player.alive) return;
  bullets.push({ x: player.x, y: player.y, dx: 0, dy: -6 });
  shootSound.currentTime = 0;
  shootSound.play();
}

// ===== Damage =====
function takeDamage(amount) {
  if (!player.alive) return;
  player.health -= amount;
  if (player.health <= 0) {
    player.alive = false;
  }
}

// ===== Update Loop =====
function update() {
  // Player movement
  if (keys["w"] || keys["ArrowUp"]) player.y -= player.speed;
  if (keys["s"] || keys["ArrowDown"]) player.y += player.speed;
  if (keys["a"] || keys["ArrowLeft"]) player.x -= player.speed;
  if (keys["d"] || keys["ArrowRight"]) player.x += player.speed;

  // Bullets
  bullets.forEach((b, i) => {
    b.y += b.dy;
    // Collision with enemies
    enemies.forEach((e) => {
      if (e.alive && Math.abs(b.x - e.x) < e.size && Math.abs(b.y - e.y) < e.size) {
        e.health -= 20;
        if (e.health <= 0) e.alive = false;
        hitSound.currentTime = 0;
        hitSound.play();
        bullets.splice(i, 1);
      }
    });
    // Remove off-screen bullets
    if (b.y < 0) bullets.splice(i, 1);
  });

  // Enemy "attacks" (simple touch damage)
  enemies.forEach((e) => {
    if (e.alive && Math.abs(player.x - e.x) < player.size && Math.abs(player.y - e.y) < player.size) {
      takeDamage(0.2); // gradual damage
    }
  });
}

// ===== Draw Loop =====
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

// Draw player
if (player.alive) {
  ctx.fillStyle = "lime";
  ctx.fillRect(player.x - 15, player.y - 15, 30, 30); // larger square
}

console.log("Game loop running");


  // Draw enemies
  enemies.forEach((e) => {
    if (e.alive) {
      ctx.fillStyle = "red";
      ctx.fillRect(e.x - e.size/2, e.y - e.size/2, e.size, e.size);
    }
  });

  // Draw bullets
  ctx.fillStyle = "yellow";
  bullets.forEach((b) => {
    ctx.fillRect(b.x - 2, b.y - 10, 4, 10);
  });

  // Health bar
  ctx.fillStyle = "red";
  ctx.fillRect(20, 20, player.health * 2, 20);
  ctx.strokeStyle = "black";
  ctx.strokeRect(20, 20, 200, 20);

  // Minimap
  drawMinimap();
}

function drawMinimap() {
  const mapSize = 100;
  const scale = 0.1;
  const offsetX = canvas.width - mapSize - 10;
  const offsetY = 10;

  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(offsetX, offsetY, mapSize, mapSize);

  // Player
  ctx.fillStyle = "green";
  ctx.fillRect(offsetX + player.x * scale, offsetY + player.y * scale, 4, 4);

  // Enemies
  ctx.fillStyle = "red";
  enemies.forEach((e) => {
    if (e.alive) {
      ctx.fillRect(offsetX + e.x * scale, offsetY + e.y * scale, 3, 3);
    }
  });
}

// =====

