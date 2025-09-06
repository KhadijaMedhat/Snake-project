const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let snake = [{ x: 10 * box, y: 10 * box }];
let food = randomFood();
let score = 0;
let speed = 150;
let direction;
let game;
//متنسيش تحطي الاصوات
const eatSound = document.getElementById("eatSound");
const gameOverSound = document.getElementById("gameOverSound");

document.addEventListener("keydown", changeDirection);
//الاكل بيتحط في مكان عشوائي بس بشرط انه يتمركز جوه ال grid لو شيلنا box/2 مش هيتمركز ولو شيلنا *box هيفضل ثابت فوق عالشمال
function randomFood() {
  return {
    x: Math.floor(Math.random() * 20) * box+ box/2 ,
    y: Math.floor(Math.random() * 20)* box  + box/2
  };
}
//الارقام 37و38و39و40 دول ارقام ثابته ف js بيدلوا على الاسهم في  ال keyboard
// بنمنع الاتجاه العكسي عشان التعبان مياكلش نفسه
function changeDirection(event) {
  if (event.keyCode == 37 && direction != "RIGHT") direction = "LEFT";
  else if (event.keyCode == 38 && direction != "DOWN") direction = "UP";
  else if (event.keyCode == 39 && direction != "LEFT") direction = "RIGHT";
  else if (event.keyCode == 40 && direction != "UP") direction = "DOWN";
}
//بنتأكد لو راس التعبان مخبطتش في قطعة من داخل المصفوفه يعني قطعة من جسمه

function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) return true;
  }
  return false;
}
//بنرسم grid فوق الخلفية السودة عن طريق اضافة box جديد كل مره بنفس المقاس في الطول والعرض
function drawGrid() {
  ctx.strokeStyle = "#111";
  for (let x = 0; x <= canvas.width; x += box) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= canvas.height; y += box) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function draw() {
  // خلفية
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawGrid();

  // رسم الطعام
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(food.x, food.y, box/2, 0, 2 * Math.PI);
  ctx.fill();

  // رسم الثعبان (دوائر متصلة)
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#00ff00" : "#0f0";
    ctx.beginPath();
    ctx.arc(snake[i].x + box/2, snake[i].y + box/2, box/2, 0, 2 * Math.PI);
    ctx.fill();
  }

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;
// السالب والموجب دول ثابتين
  if (direction == "LEFT") snakeX -= box;
  if (direction == "UP") snakeY -= box;
  if (direction == "RIGHT") snakeX += box;
  if (direction == "DOWN") snakeY += box;
//بنتأكد ان المسافه مبين مركز الرأس ومركز الطعام اقل من حجم مربع واحد يعني بمجرد ميلمس الطعام بيطول مش لازم يعدي عليه ويروح للمربع اللي بعده عشان يفهم انه اكله
//لما ياكل بنزود ال score
//بنحدث الاسكور الجديد
//بنشغل الصوت
//بنظهر الطعام فمكان مختلف عشوائي
//بنزود السرعة تدريجيا كل 5 نقط
if (Math.abs(snakeX + box/2 - food.x) < box && Math.abs(snakeY + box/2 - food.y) < box) {
    score++;
    document.getElementById("score").innerText = "Score: " + score;
    eatSound.play();
    food = randomFood();
    if (score % 10 === 0 && speed > 50) {
      clearInterval(game);
      //بنزود السرعة عن طريق تقلييل الفاصل الزمني بين الرسومات
      speed -= 1;
      // اللعبة بتبدأ تاني بالسرعة الجديدة بس دي حاجه سريعة مش بنلاحظها
      game = setInterval(draw, speed);
    }
  } else {
    // لو مأكلش هينقص دايرة بس دا مبيحصلش فعليا هو بس مبيزدش على عكس لما ياكل فبنعملها ب pop
    snake.pop();
  }

  let newHead = { x: snakeX, y: snakeY };
//بنتأكد انه مخبطش في الاطار او الحائط او جسمه
  if (
    snakeX < 0 || snakeY < 0 ||
    snakeX >= canvas.width || snakeY >= canvas.height ||
    collision(newHead, snake)
  ) {
      // لو خسر بنظهرله alert , sound
    clearInterval(game);
    gameOverSound.play();
   setTimeout(()=>{
    alert("Game Over! Your score: " + score);
    location.reload();
   },500 );
  }
// المصفوفه بيكون فيها راس بس وكل الجسم بيختفي
  snake.unshift(newHead);
}

// بدء اللعبة
game = setInterval(draw, speed);
