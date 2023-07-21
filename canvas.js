const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Set circle colors
const yellow = '#FFBC42';
const blue = '#3993DD';
const red = '#be0000';
const green = '#00dc6e';
const colors = [yellow, blue, red, green];

const arrowWidth = 8;
const arrowColor = 'black';

// Circle properties
const circleRadius = 25;
let startX = 45;
let startY = 33;
const startAngle = 0;
const endAngle = 2 * Math.PI;

// Circle objects
const circles = [];

// Create circle objects and add event listeners
for (let i = 0; i < colors.length; i++) {
  const circle = {
    x: startX,
    y: startY,
    radius: circleRadius,
    color: colors[i],
    hit: false
  };

  circles.push(circle);

  // Add event listener to circle
  canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    if (isInsideCircle(clickX, clickY, circle)) {
      circle.hit = true;
      animateArrowToCircle(circle);
    }
  });

  startY += 55;
}

// Check if a point is inside a circle
function isInsideCircle(x, y, circle) {
  const dx = x - circle.x;
  const dy = y - circle.y;
  return dx * dx + dy * dy <= circle.radius * circle.radius;
}

// Draw the circles
function drawCircles() {
  for (let i = 0; i < circles.length; i++) {
    const circle = circles[i];

    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, startAngle, endAngle);
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = circle.color;
    ctx.lineWidth = 1;
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }
}

// Draw the arrow
function drawArrow(fromx, fromy, tox, toy) {
  const headlen = 10;
  const angle = Math.atan2(toy - fromy, tox - fromx);

  ctx.save();
  ctx.strokeStyle = arrowColor;

  // Starting path of the arrow from the start square to the end square
  // and drawing the stroke
  ctx.beginPath();
  ctx.moveTo(fromx, fromy);
  ctx.lineTo(tox, toy);
  ctx.lineWidth = arrowWidth;
  ctx.stroke();

  // Starting a new path from the head of the arrow to one of the sides of the point
  ctx.beginPath();
  ctx.moveTo(tox, toy);
  ctx.lineTo(
    tox - headlen * Math.cos(angle - Math.PI / 7),
    toy - headlen * Math.sin(angle - Math.PI / 7)
  );

  // Path from the side point of the arrow to the other side point
  ctx.lineTo(
    tox - headlen * Math.cos(angle + Math.PI / 7),
    toy - headlen * Math.sin(angle + Math.PI / 7)
  );

  // Path from the side point back to the tip of the arrow, and then
  // again to the opposite side point
  ctx.lineTo(tox, toy);
  ctx.lineTo(
    tox - headlen * Math.cos(angle - Math.PI / 7),
    toy - headlen * Math.sin(angle - Math.PI / 7)
  );

  // Draw the paths created above
  ctx.stroke();
  ctx.restore();
}

// Animate the arrow towards the clicked circle
function animateArrowToCircle(circle) {
  const targetX = circle.x;
  const targetY = circle.y;
  const arrowStartX = 470;
  const arrowStartY = circle.y;

  let arrowX = arrowStartX;
  let arrowY = arrowStartY;

  const animation = setInterval(function() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw circles
    drawCircles();

    // Draw arrow
    drawArrow(arrowStartX, arrowStartY, arrowX, arrowY);

    // Move arrow towards the circle
    const dx = targetX - arrowX;
    const dy = targetY - arrowY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const speed = 5;
    
    if (distance <= speed) {
      // Arrow reached the target circle
      clearInterval(animation);
      circle.hit = true;
      circle.color = '#000000'; // Change the color of the circle

      // Redraw circles and arrows
      drawCircles();
      callArrow();
    } else {
      // Move the arrow closer to the target
      arrowX += (dx / distance) * speed;
      arrowY += (dy / distance) * speed;
    }
  }, 10);
}

// Draw initial circles
drawCircles();

// Draw arrows
function callArrow() {
  const arrowStartX = 470;
  let arrowStartY = 33;
  let arrowEndX = 430;

  for (let i = 0; i < circles.length; i++) {
    const circle = circles[i];

    if (!circle.hit) {
      drawArrow(arrowStartX, arrowStartY, arrowEndX, circle.y);
    }

    arrowStartY += 55;
  }
}

callArrow();

// Reset button
const resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', resetCanvas);

function resetCanvas() {
  for (let i = 0; i < circles.length; i++) {
    const circle = circles[i];
    circle.hit = false;
    circle.color = colors[i];
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCircles();
  callArrow();
}
