//state of the game
let unitLength = 20;
let columns = 0;
let rows = 0;
let board = undefined;
let fr;
//let img;
let pattern = generatePattern();
let penColorInput = document.querySelector("#penColor");
let penColor;
let colorMode = "pen"; //pen or rainbow

//style
let bgC = [255, 255, 255];
let originColor = "rgb(215, 239, 251)";
let originStrokeColor = "rgb(206, 200, 200)";
let originStrokeWeight = 1;
let lifeColor = "rgb(134, 170, 220)";
let lifeStroke = "rgb(98, 136, 191)";
let sWeight = 1;
let drawColor = "lightgray";
let drawStroke = "rgb(236, 202, 218)";
let stasisColor = "darkgray";

//rule
let lonely = 2;
let over = 3;
let repo = 3;

window.addEventListener("load", function () {
  //setTimeout(function open(event) {
  document.querySelector(".popup").style.display = "block";
  //}, 100);
});

document.querySelector("#close").addEventListener("click", function () {
  document.querySelector(".popup").style.display = "none";
});

penColorInput.value = drawColor;
penColorInput.addEventListener("change", () => {
  penColor = penColorInput.value;
  drawColor = penColor;
  colorMode = "pen";
});

document.querySelector("#rainbow").addEventListener("click", () => {
  if (colorMode === "pen") {
    colorMode = "rainbow";
  } else {
    colorMode = "pen";
  }
});

function getRainbowColor(x, y) {
  let r = (x / columns) * 255;
  // r = (r + time) % 255
  let g = (y / rows) * 255;
  let b = (x + y) / (columns + rows) / 255;
  b = 127;
  let colorCodes = [r, g, b].map((value) => value / 2 + 127);
  return color(colorCodes);
}

const LIVING_PATTERN = 0;
const TURTLE = 1;
//const p = generatePattern(TURTLE);
function generatePattern(idx /*LIVING_PATTERN,TURTLE*/) {
  let patternText = `
  x
  `;

  let patternArr = [`x`, `..x..`];
  const p = patternArr[idx];

  let lines = patternText.split("\n");
  lines = lines.slice(1, lines.length - 1);

  let values = lines.map((line) =>
    line
      .trim()
      .split("")
      .map((char) => (char === "." ? 0 : 1))
  );

  let height = values.length;
  let width = values.reduce(
    (accWidth, line) => Math.max(line.length, accWidth),
    0
  );

  let halfHeight = Math.floor(height / 2);
  let halfWidth = Math.floor(width / 2);

  return {
    values,
    halfWidth,
    halfHeight,
  };
}

/*setup*/

function setup() {
  const canvas = createCanvas(windowWidth - 313, windowHeight - 340); //height
  canvas.parent(document.querySelector("#canvas"));

  columns = floor(width / unitLength);
  rows = floor(height / unitLength);

  board = [];

  init();
  bgC = originColor;
}

let isRun = true;
function resized() {
  const canvas = createCanvas(windowWidth - 313, windowHeight - 340);
  canvas.parent(document.querySelector("#canvas"));
  columns = floor(width / unitLength);
  rows = floor(height / unitLength);
  board = [];

  init();
  isRun = false;
  setTimeout(() => {
    isRun = true;
  }, 1000);
}

//windowResized
function windowResized() {
  resized();
}

function init() {
  for (let i = 0; i < columns; i++) {
    board[i] = [];
    for (let j = 0; j < rows; j++) {
      board[i][j] = {
        alive: random() > 0.8 ? 1 : 0,
        nextAlive: 0,
        color: originColor,
        generation: 0,
      };
    }
  }
}

function setupReset() {
  const canvas = createCanvas(windowWidth - 313, windowHeight - 340);
  canvas.parent(document.querySelector("#canvas"));
  columns = floor(width / unitLength);
  rows = floor(height / unitLength);
  board = [];

  originColor = "rgb(215, 239, 251)";

  stroke("rgb(215, 239, 251)");
  originStrokeWeight = 1;

  initReset();
  bgC = originColor;
}

function initReset() {
  for (let i = 0; i < columns; i++) {
    board[i] = [];
    for (let j = 0; j < rows; j++) {
      board[i][j] = {
        alive: 0,
        nextAlive: 0,
        color: originColor,
        generation: 0,
      };
    }
  }
}

function draw() {
  background(bgC);
  if (isRun) {
    generate();
  }

  fr = document.querySelector("#slide");
  frameRate(parseInt(fr.value));

  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      stroke(originStrokeColor);
      strokeWeight(originStrokeWeight);
      let cell = board[x][y];
      if (
        cell.alive == 1 &&
        cell.nextAlive == cell.alive &&
        cell.generation > 200 &&
        cell.color == penColor
      ) {
        fill(random(255), random(255), random(255));
        strokeWeight(4);
        stroke("yellow");
      } else if (
        cell.alive == 1 &&
        cell.nextAlive == cell.alive &&
        cell.generation > 200
      ) {
        fill(random(255), random(255), random(255));
      } else if (
        cell.alive == 1 &&
        cell.nextAlive == cell.alive &&
        cell.generation > 20 &&
        cell.color == penColor
      ) {
        strokeWeight(4);
        stroke("yellow");
        fill(penColor);
      } else if (
        cell.alive == 1 &&
        cell.nextAlive == cell.alive &&
        cell.generation > 20
      ) {
        fill(stasisColor);
      } else if (cell.alive == 1 && colorMode === "rainbow") {
        fill(getRainbowColor(x, y));
      } else if (cell.alive == 1 && cell.color == penColor) {
        fill(cell.color);
      } else if (cell.alive == 1) {
        fill(lifeColor);
        strokeWeight(sWeight);
        stroke(lifeStroke);
      } else {
        fill(originColor);
        stroke(originStrokeColor);
        strokeWeight(1);
      }

      rect(x * unitLength, y * unitLength, unitLength, unitLength, 20);
    }
  }
}

function generate() {
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      let cell = board[x][y];
      let neighbors = 0;
      for (let dx of [-1, 0, 1]) {
        for (let dy of [-1, 0, 1]) {
          if (dx == 0 && dy == 0) {
            continue;
          }
          let peerX = (x + dx + columns) % columns;
          let peerY = (y + dy + rows) % rows;
          neighbors += board[peerX][peerY].alive;
        }
      }
      rule(x, y, neighbors);
    }
  }
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      let cell = board[x][y];
      cell.alive = cell.nextAlive;
    }
  }
}

//Mouse Interaction

function mouseDragged() {
  //noLoop();

  if (
    mouseX > unitLength * columns ||
    mouseY > unitLength * rows ||
    mouseY < 0 ||
    mouseX < 0
  ) {
    return;
  }
  let sx = Math.floor(mouseX / unitLength);
  let sy = Math.floor(mouseY / unitLength);

  //pattern

  const cy = sy - pattern.halfHeight;
  const cx = sx - pattern.halfWidth;

  pattern.values.forEach((line, yIndex) => {
    line.forEach((value, xIndex) => {
      let py = yIndex + cy;
      let px = xIndex + cx;
      placeCell(px, py, value);
    });
  });
}

function placeCell(px, py, value) {
  px = (px + columns) % columns;
  py = (py + rows) % rows;

  board[px][py].alive = value;
  board[px][py].color = drawColor;
  if (value == 1 && colorMode === "rainbow") {
    fill(getRainbowColor(px, py));
  } else if (value == 1) {
    fill(drawColor);
    strokeWeight(1);
    stroke("rgb(215, 239, 251)");
    board[px][py].generation = 0;
  } else {
    fill(originColor);
    stroke(originStrokeColor);
    strokeWeight(1);
  }

  rect(px * unitLength, py * unitLength, unitLength, unitLength, 20);
}

//document.querySelector(".click").addEventListener("click", function () {
function mousePressed() {
  noLoop();
  mouseDragged();
}
//});

function mouseReleased() {
  loop();
}

function rule(x, y, neighbors) {
  let cell = board[x][y];
  if (cell.alive == 1 && neighbors < lonely) {
    cell.nextAlive = 0;
    cell.generation = 0;
    cell.color = originColor;
  } else if (cell.alive == 1 && neighbors > 3) {
    cell.nextAlive = 0;
    cell.generation = 0;
    cell.color = originColor;
  } else if (cell.alive == 0 && neighbors == repo) {
    cell.nextAlive = 1;
    cell.generation = 0;
    cell.color = originColor;
  } else {
    //Stasis;
    cell.nextAlive = cell.alive;
    cell.generation++;
  }
}

document.querySelector("#lonely").addEventListener("change", (event) => {
  lonely = event.target.value;
});

document.querySelector("#over").addEventListener("change", (event) => {
  over = event.target.value;
});

document.querySelector("#repo").addEventListener("change", (event) => {
  repo = event.target.value;
});

document.querySelector("#slide").addEventListener("change", function (event) {
  fr = event.target.value;
});

//button
document.querySelector(".bi-pause-fill").addEventListener("click", function () {
  noLoop();
});

document.querySelector("#start").addEventListener("click", function () {
  loop();
});

document.querySelector("#reset-game").addEventListener("click", function () {
  setupReset();
  loop();
});

document.querySelector("#random").addEventListener("click", function () {
  init();
  loop();
});

document.querySelector("#plus").addEventListener("click", function () {
  unitLength += 5;
  setupReset();
});

document.querySelector("#minus").addEventListener("click", function () {
  unitLength -= 5;
  setupReset();
});

//pattern

document.querySelector(".dot").addEventListener("click", function () {
  pattern = generatePattern();
});

document.querySelector(".mirror").addEventListener("click", function () {
  pattern = generatePatternMirror();
});

document.querySelector(".gun").addEventListener("click", function () {
  pattern = generatePatternGun();
});

document.querySelector(".pulsar").addEventListener("click", function () {
  pattern = generatePatternPulsar();
});

document.querySelector(".living").addEventListener("click", function () {
  pattern = generatePatternLiving1();
});

document.querySelector(".turtle").addEventListener("click", function () {
  pattern = generatePatternTurtle();
});

const themes = {
  spring: {
    originColor: "rgb(211,226,180)",
  },
  summer: {
    originColor: "rgb(215, 239, 251)",
  },
};

function clickHandler(event) {
  const id = event.target.id;
  originColor = themes[id].originColor;
}

//style
document.querySelector("#spring").addEventListener(
  "click",
  clickHandler /*function () {
  originColor = "rgb(211,226,180)";
  originStrokeColor = "rgb(206, 200, 200)";
  lifeColor = "rgb(129,156,84)";
  lifeStroke = "rgb(206, 200, 200)";
  bgC = originColor;
}*/
);

document.querySelector("#spring").addEventListener("click", function () {
  originColor = "rgb(211,226,180)";
  originStrokeColor = "rgb(206, 200, 200)";
  lifeColor = "rgb(129,156,84)";
  lifeStroke = "rgb(206, 200, 200)";
  bgC = originColor;
});

document.querySelector("#summer").addEventListener("click", function () {
  originColor = "rgb(215, 239, 251)";
  originStrokeColor = "rgb(206, 200, 200)";
  lifeColor = "rgb(134, 170, 220)";
  lifeStroke = "rgb(206, 200, 200)";
  originColor = bgC = originColor;
});

document.querySelector("#autumn").addEventListener("click", function () {
  originColor = "rgb(225, 184, 160)";
  originStrokeColor = "rgb(206, 200, 200)";
  lifeColor = "rgb(173,88,63)";
  lifeStroke = "rgb(206, 200, 200)";
  bgC = originColor;
});

document.querySelector("#winter").addEventListener("click", function () {
  originColor = "rgb(128, 108, 120)";
  originStrokeColor = "rgb(206, 200, 200)";
  lifeColor = "rgb(114, 67, 95)";
  lifeStroke = "rgb(206, 200, 200)";
  bgC = originColor;
});

//pattern
function generatePatternMirror() {
  let patternText2 = `
  .........
  .xx...xx.
  .x.x.x.x.
  .x..x..x.
  .x.....x.
`;

  let lines = patternText2.split("\n");
  lines = lines.slice(1, lines.length - 1);

  let values = lines.map((line) =>
    line
      .trim()
      .split("")
      .map((char) => (char === "." ? 0 : 1))
  );

  let height = values.length;
  let width = values.reduce(
    (accWidth, line) => Math.max(line.length, accWidth),
    0
  );

  let halfHeight = Math.floor(height / 2);
  let halfWidth = Math.floor(width / 2);

  return {
    values,
    halfWidth,
    halfHeight,
  };
}

function generatePatternPulsar() {
  let patternText2 = `
.............
..XXX...XXX..
.X...X.X...X.
.X...X.X...X.
.X...X.X...X.
..XXX...XXX..
.............
..XXX...XXX..
.X...X.X...X.
.X...X.X...X.
.X...X.X...X.
..XXX...XXX..
.............
`;

  let lines = patternText2.split("\n");
  lines = lines.slice(1, lines.length - 1);

  let values = lines.map((line) =>
    line
      .trim()
      .split("")
      .map((char) => (char === "." ? 0 : 1))
  );

  let height = values.length;
  let width = values.reduce(
    (accWidth, line) => Math.max(line.length, accWidth),
    0
  );

  let halfHeight = Math.floor(height / 2);
  let halfWidth = Math.floor(width / 2);

  return {
    values,
    halfWidth,
    halfHeight,
  };
}

function generatePatternLiving1() {
  let patternText2 = `
..........
.......X..
.....X.XX.
.....X.X..
.....X....
...X......
.X.X......
..........
  `;

  let lines = patternText2.split("\n");
  lines = lines.slice(1, lines.length - 1);

  let values = lines.map((line) =>
    line
      .trim()
      .split("")
      .map((char) => (char === "." ? 0 : 1))
  );

  let height = values.length;
  let width = values.reduce(
    (accWidth, line) => Math.max(line.length, accWidth),
    0
  );

  let halfHeight = Math.floor(height / 2);
  let halfWidth = Math.floor(width / 2);

  return {
    values,
    halfWidth,
    halfHeight,
  };
}

function generatePatternTurtle() {
  let patternText2 = `
..............
..OOO.......O.
..OO..O.OO.OO.
....OOO....O..
..O..O.O...O..
.O....O....O..
.O....O....O..
..O..O.O...O..
....OOO....O..
..OO..O.OO.OO.
..OOO.......O.
  `;

  let lines = patternText2.split("\n");
  lines = lines.slice(1, lines.length - 1);

  let values = lines.map((line) =>
    line
      .trim()
      .split("")
      .map((char) => (char === "." ? 0 : 1))
  );

  let height = values.length;
  let width = values.reduce(
    (accWidth, line) => Math.max(line.length, accWidth),
    0
  );

  let halfHeight = Math.floor(height / 2);
  let halfWidth = Math.floor(width / 2);

  return {
    values,
    halfWidth,
    halfHeight,
  };
}

function generatePatternGun() {
  let patternText2 = `
......................................
.........................X............
.......................X.X............
.............XX......XX............XX.
............X...X....XX............XX.
.XX........X.....X...XX...............
.XX........X...X.XX....X.X............
...........X.....X.......X............
............X...X.....................
.............XX.......................
......................................
  `;

  let lines = patternText2.split("\n");
  lines = lines.slice(1, lines.length - 1);

  let values = lines.map((line) =>
    line
      .trim()
      .split("")
      .map((char) => (char === "." ? 0 : 1))
  );

  let height = values.length;
  let width = values.reduce(
    (accWidth, line) => Math.max(line.length, accWidth),
    0
  );

  let halfHeight = Math.floor(height / 2);
  let halfWidth = Math.floor(width / 2);

  return {
    values,
    halfWidth,
    halfHeight,
  };
}
