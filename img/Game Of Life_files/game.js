//state of the game
let unitLength = 20;
let columns;
let rows;
let board;
let fr;
let img;
let pattern = generatePattern();

//style
let bgC = (228, 228, 224);
let originColor = (42, 42, 42);
let originStrokeColor = "black";
let originStrokeWeight = 1;
let lifeColor = "yellow";
let lifeStroke = "orange";
let sWeight = 4;
let drawColor = "lightgray";
let drawStroke = "gray";
let stasisColor1 = "pink";
let stasisColor2 = "violet";
let stasisColor3 = "darkred";

//rule
let lonely = 2;
let over = 3;
let repo = 3;

function generatePattern() {
  let patternText = `
  x
  `;

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

function placeCell(px, py, value) {
  px = (px + columns) % columns;
  py = (py + rows) % rows;

  board[px][py].alive = value;
  board[px][py].color = "yellow";
  if (value == 1) {
    fill(drawColor);
  } else {
    fill(originColor);
  }

  rect(px * unitLength, py * unitLength, unitLength, unitLength);
}

/*setup*/

function preload() {
  img = loadImage(
    //"https://i5.walmartimages.com/asr/e892cad9-8b09-4d04-b5a4-1feb55faf147.716cd82006a6b9afb191665b4442d51d.jpeg"
    "https://thumbs.dreamstime.com/b/survival-word-gr-stencil-print-grunge-white-brick-wall-82285195.jpg"
  );
}

function setup() {
  const canvas = createCanvas(windowWidth - 80, windowHeight - 380); //height
  canvas.parent(document.querySelector("#canvas"));

  columns = floor(width / unitLength);
  rows = floor(height / unitLength);

  board = [];

  init();
  image(img, 0, 0);
}

function resized() {
  const canvas = createCanvas(windowWidth - 80, windowHeight - 380);
  canvas.parent(document.querySelector("#canvas"));
  columns = floor(width / unitLength);
  rows = floor(height / unitLength);
  board = [];

  init();
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
  const canvas = createCanvas(windowWidth - 30, windowHeight - 100);
  canvas.parent(document.querySelector("#canvas"));
  columns = floor(width / unitLength);
  rows = floor(height / unitLength);
  board = [];
  bgC = (228, 228, 224);
  originColor = (42, 42, 42);
  originStrokeColor = "black";
  originStrokeWeight = 1;

  initReset();
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
  fr = document.querySelector("#slide");
  background(bgC);
  generate();
  frameRate(parseInt(fr.value));

  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      stroke(originStrokeColor);
      strokeWeight(originStrokeWeight);
      let cell = board[x][y];
      if (
        cell.alive == 1 &&
        cell.nextAlive == cell.alive &&
        cell.generation > 200
      ) {
        fill(random(255), random(255), random(255));
        originColor = [255, 255, 255, 0];
        originStrokeWeight = 0;
        sWeight = 0;
        bgC = img;
      } else if (
        cell.alive == 1 &&
        cell.nextAlive == cell.alive &&
        cell.generation > 6
      ) {
        fill(stasisColor3);
      } else if (
        cell.alive == 1 &&
        cell.nextAlive == cell.alive &&
        cell.generation > 4
      ) {
        fill(stasisColor2);
      } else if (
        cell.alive == 1 &&
        cell.nextAlive == cell.alive &&
        cell.generation > 1
      ) {
        fill(stasisColor1);
      } else if (cell.alive == 1) {
        fill(lifeColor);
        strokeWeight(sWeight);
        stroke(lifeStroke);
      } else {
        fill(originColor);
        //fill(0, 0, 0, 0.5);
      }

      rect(x * unitLength, y * unitLength, unitLength, unitLength);
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
  noLoop();

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

  // board[x][y].alive = 1;

  // if (board[x][y].alive == 1) {
  //   drawColor = "lightgray";
  //   fill(drawColor);
  //   stroke(drawStroke);
  //   strokeWeight(2);
  // }
  //rect(x * unitLength, y * unitLength, unitLength, unitLength);
}

function placeCell(px, py, value) {
  px = (px + columns) % columns;
  py = (py + rows) % rows;

  board[px][py].alive = value;
  board[px][py].color = "yellow";
  if (value == 1) {
    fill(drawColor);
  } else {
    fill(originColor);
  }

  rect(px * unitLength, py * unitLength, unitLength, unitLength);
}

document.querySelector(".click").addEventListener("click", function () {
  function mousePressed() {
    mouseDragged();
  }
});

function mouseReleased() {
  loop();
}

function rule(x, y, neighbors) {
  let cell = board[x][y];
  if (cell.alive == 1 && neighbors < lonely) {
    cell.nextAlive = 0;
    cell.generation = 0;
  } else if (cell.alive == 1 && neighbors > 3) {
    cell.nextAlive = 0;
    cell.generation = 0;
  } else if (cell.alive == 0 && neighbors == repo) {
    cell.nextAlive = 1;
    cell.generation = 0;
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
  setup();
});

document.querySelector("#minus").addEventListener("click", function () {
  unitLength -= 5;
  setup();
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

//style
document.querySelector("#bw").addEventListener("click", function () {
  lifeColor = "white";
  lifeStroke = "lightgray";
  stasisColor1 = "gray";
  stasisColor2 = "darkgray";
  stasisColor3 = "black";
});

document.querySelector("#rc").addEventListener("click", function () {
  originColor = "white";
  originStroke = "white";
  lifeColor = [random(255), random(255), random(255)];
  lifeStroke = [random(255), random(255), random(255)];
  stasisColor1 = [random(255), random(255), random(255)];
  stasisColor2 = "darkblue";
  stasisColor3 = "darkpurple";
});

document.querySelector("#ma").addEventListener("click", function () {
  originColor = [255, 255, 255, 0];
  lifeColor = "lightyellow";
  lifeStroke = "lightblue";
  originStrokeWeight = 0;
  sWeight = 2;
  drawColor = " #FFC98C";
  stasisColor1 = "skyblue";
  stasisColor2 = "lightpink";
  stasisColor3 = "lightgreen";
});

document.querySelector("#de").addEventListener("click", function () {
  originColor = (42, 42, 42);
  originStrokeColor = "black";
  originStrokeWeight = 1;
  lifeColor = "yellow";
  lifeStroke = "orange";
  sWeight = 4;
  drawColor = "lightgray";
  drawStroke = "gray";
  stasisColor1 = "pink";
  stasisColor2 = "violet";
  stasisColor3 = "darkred";
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
