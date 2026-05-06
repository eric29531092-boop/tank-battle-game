const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 游戏配置参数
const config = {
  tankSize: 40,
  bulletSize: 8,
  tankSpeed: 2,
  bulletSpeed: 4,
};

// 玩家坦克
const player = {
  x: 100,
  y: 100,
  width: config.tankSize,
  height: config.tankSize,
  color: "blue",
  direction: "up", // 当前方向
  move(direction) {
    const step = config.tankSpeed;
    if (direction === "up" && this.y > 0) this.y -= step;
    else if (direction === "down" && this.y + this.height < canvas.height) this.y += step;
    else if (direction === "left" && this.x > 0) this.x -= step;
    else if (direction === "right" && this.x + this.width < canvas.width) this.x += step;
    this.direction = direction; // 更新方向
  },
};

// 子弹
const bullets = [];

// 敌人坦克
const enemies = [
  { x: 500, y: 200, width: config.tankSize, height: config.tankSize, color: "red", direction: "down" },
];

// 更新游戏逻辑
function update() {
  // 更新子弹移动
  bullets.forEach((bullet, index) => {
    if (bullet.direction === "up") bullet.y -= config.bulletSpeed;
    else if (bullet.direction === "down") bullet.y += config.bulletSpeed;
    else if (bullet.direction === "left") bullet.x -= config.bulletSpeed;
    else if (bullet.direction === "right") bullet.x += config.bulletSpeed;

    // 子弹超出边界
    if (
      bullet.x < 0 || bullet.x > canvas.width ||
      bullet.y < 0 || bullet.y > canvas.height
    ) {
      bullets.splice(index, 1); // 删除子弹
    }

    // 检测子弹与敌人碰撞
    enemies.forEach((enemy, i) => {
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + config.bulletSize > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + config.bulletSize > enemy.y
      ) {
        enemies.splice(i, 1); // 击中敌人，移除
        bullets.splice(index, 1); // 子弹消失
      }
    });
  });

  // 更新敌人随机移动
  enemies.forEach((enemy) => {
    const step = config.tankSpeed * 0.5; // 敌人移动速度较慢
    const directions = ["up", "down", "left", "right"];
    const randomDir = directions[Math.floor(Math.random() * directions.length)];

    if (randomDir === "up" && enemy.y > 0) enemy.y -= step;
    else if (randomDir === "down" && enemy.y + enemy.height < canvas.height) enemy.y += step;
    else if (randomDir === "left" && enemy.x > 0) enemy.x -= step;
    else if (randomDir === "right" && enemy.x + enemy.width < canvas.width) enemy.x += step;
  });
}

// 渲染游戏画面
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 绘制玩家坦克
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // 绘制子弹
  bullets.forEach((bullet) => {
    ctx.fillStyle = "yellow";
    ctx.fillRect(bullet.x, bullet.y, config.bulletSize, config.bulletSize);
  });

  // 绘制敌人
  enemies.forEach((enemy) => {
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  });
}

// 处理键盘事件
window.addEventListener("keydown", (e) => {
  if (e.key === "w") player.move("up");
  if (e.key === "s") player.move("down");
  if (e.key === "a") player.move("left");
  if (e.key === "d") player.move("right");

  // 发射子弹
  if (e.key === " ") {
    const bullet = {
      x: player.x + config.tankSize / 2 - config.bulletSize / 2,
      y: player.y + config.tankSize / 2 - config.bulletSize / 2,
      direction: player.direction,
    };
    bullets.push(bullet);
  }
});

// 游戏循环
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();