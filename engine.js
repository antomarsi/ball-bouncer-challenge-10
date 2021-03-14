/**
 * Get Canvas, Context Canvas, balls quantity label, pop sound and
 * initialize collision.
 */
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const ballQtdLabel = document.getElementById("ball-qtd");
const popSound = new Audio("pop.mp3");
var enabledCollision = false;

/**
 * Set the circuference for pi (a circle).
 */

const circleCircuference = 2 * Math.PI;

/**
 * Get the current windows width, apply to canvas.
 */
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/**
 * Class for position X and Y
 */
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  getDistance(position) {
    const dx = this.x - position.x;
    const dy = this.y - position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance;
  }
}

/**
 * Create balls array to store balls data.
 */
const balls = [];

/**
 * Create array for destroyed balls.
 */
const ballsDestroyed = [];

/**
 * Base Ball class, handle draw and movement
 */
class BaseBall {
  constructor(position, velocity, size, color) {
    this.position = position;
    this.velocity = velocity;
    this.size = size;
    this.color = color;
  }

  /**
   * Getters
   */
  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }
  /**
   * Setters
   */
  set x(value) {
    this.position.x = value;
  }
  set y(value) {
    this.position.y = value;
  }
  /**
   * Draw function.
   */
  onDraw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.position.x, this.position.y, this.size, 0, circleCircuference);
    ctx.fill();
  }
  /**
   * Base ball update function.
   */
  onUpdate() {
    this.onDraw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

/**
 * Create Ball class to use as entity
 */
class Ball extends BaseBall {
  constructor(position, velocity, size, color) {
    super(position, velocity, size, color);
  }
  /**
   * Ball's update function. Render the ball on canvas and detect collisions.
   */
  onUpdate() {
    this.onDraw();
    this.onCollideSides();
    if (enabledCollision) {
      this.collisionDetection();
    }
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }

  /**
   * Detect collision with canvas bounderies.
   */
  onCollideSides() {
    if (this.x + this.size >= canvas.width || this.x + this.size <= 0) {
      this.velocity.x *= -1;
    }
    if (this.y + this.size >= canvas.height || this.y + this.size <= 0) {
      this.velocity.y *= -1;
    }
  }
  /**
   * Detect collision with other balls.
   */
  collisionDetection() {
    for (let index = 0; index < balls.length; index++) {
      const otherBall = balls[index];
      if (otherBall === this) continue;
      const distance = this.position.getDistance(otherBall.position);
      if (distance < this.size + otherBall.size) {
        if (otherBall.x > this.x) this.velocity.x *= -1;
        else if (otherBall.y > this.y) this.velocity.y *= -1;
        else {
          this.velocity.x *= -1;
          this.velocity.x *= -1;
        }
        break;
      }
    }
  }
}

/**
 * Easing out function.
 */
function easeOutQuad(x) {
  return;
}

/**
 * Main engine loop
 */
function mainLoop() {
  /**
   * Set the background with 0.5 opacity to cool fade effect.
   */
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let index = 0; index < balls.length; index++) {
    balls[index].onUpdate();
  }

  requestAnimationFrame(mainLoop);
}
/**
 * function Called when window is resized.
 */
function onWindowResize() {
  /**
   * Resize Canvas.
   */
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  /**
   * Reposition Balls.
   */
  for (let index = 0; index < array.length; index++) {
    const ball = array[index];
    if (ball.x >= canvas.width) {
      ball.x = canvas.width - ball.size / 2;
      ball.velocity.x *= -1;
    }
    if (ball.y >= canvas.height) {
      ball.y = canvas.height - ball.size / 2;
      ball.velocity.y *= -1;
    }
  }
}

/**
 * Function that return a random value between min and max.
 * @param {number} min minimun value
 * @param {number} max maximun value
 * @returns
 */
function randomMinMax(min, max) {
  return Math.floor(Math.random() * (max + min)) + min;
}

/**
 * Add a new ball with random attributes to the array.
 */
function addBall() {
  const randomVelocity = new Point(
    randomMinMax(-10, 10),
    randomMinMax(-10, 10)
  );
  const randomSize = randomMinMax(10, 50);
  const randomColor = `rgb(${randomMinMax(0, 255)},${randomMinMax(
    0,
    255
  )},${randomMinMax(0, 255)})`;
  const randomPosition = new Point(
    randomMinMax(0, canvas.width - randomSize),
    randomMinMax(0, canvas.height - randomSize)
  );
  const newBall = new Ball(
    randomPosition,
    randomVelocity,
    randomSize,
    randomColor
  );
  balls.push(newBall);
  ballQtdLabel.innerText = balls.length;
  popSound.cloneNode(true).play();
}

/**
 * Clear all balls.
 */
function reset() {
  balls.splice(0, balls.length);
  popSound.cloneNode(true).play();
}

/**
 * Start main loop.
 */
mainLoop();
window.addEventListener("resize", onWindowResize);

/**
 * Toggle collision of balls between them.
 */
function toggleCollision(btn) {
  enabledCollision = !enabledCollision;
  btn.innerText = enabledCollision ? "Collision Enabled" : "Collision Disabled";
}
