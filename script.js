// import Game from "./game.js";

let canvas = document.getElementById("gameScreen");
let ctx = canvas.getContext("2d");

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

document.addEventListener("keydown", (event) => {
  switch (event.keyCode) {
    case 39:
      moveRight(grid);
      updateScreen(grid);
      break;
    case 37:
      moveLeft(grid);
      updateScreen(grid);
      break;
    case 38:
      moveUp(grid);
      updateScreen(grid);
      break;
    case 40:
      moveDown(grid);
      updateScreen(grid);
      break;
  }
});

function drawStartingGrid() {
  ctx.fillStyle = "#bbada0";
  ctx.rect(0, 0, 410, 410);
  ctx.fill();

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      // ctx.fillStyle = "rgba(238, 228, 218, 0.35)";
      ctx.fillStyle= "lightgray"
      ctx.fillRect(i * 100 + 10, j * 100 + 10, 90, 90);
      // ctx.fill();
    }
  }
}

drawStartingGrid();

function newGrid() {
  return [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
}

let grid = newGrid();

function emptyTiles(grid) {
  let emptyTiles = [];
  grid.forEach((row, i) =>
    row.forEach((col, j) => {
      if (grid[i][j] == 0) {
        emptyTiles.push({ x: i, y: j });
      }
    })
  );
  return emptyTiles;
}

// console.log(emptyTiles(grid));

function addNewNumber(grid) {
  let possiblePositions = emptyTiles(grid);
  let randomPosition = Math.floor(Math.random() * possiblePositions.length);
  grid[possiblePositions[randomPosition].x][
    possiblePositions[randomPosition].y
  ] = 2;
  return grid;
}
addNewNumber(grid);
addNewNumber(grid);
// console.table(grid);

// grid = [
//   [1, 2, 3, 4],
//   [5, 6, 7, 8],
//   [9, 10, 11, 12],
//   [13, 14, 15, 16]
// ];

const properties = {
  2: { color: "#eee4da", fontColor: "#776e65", font: "bold 45px arial" },
  4: { color: "#ede0c8", fontColor: "#776e65", font: "bold 45px arial" },
  8: { color: "#f2b179", fontColor: "#f9f6f2", font: "bold 45px arial" },
  16: { color: "#f59563", fontColor: "#f9f6f2", font: "bold 45px arial" },
  32: { color: "#f67c5f", fontColor: "#f9f6f2", font: "bold 45px arial" },
  64: { color: "#f65e3b", fontColor: "#f9f6f2", font: "bold 45px arial" },
  128: { color: "#edcf72", fontColor: "#f9f6f2", font: "bold 45px arial" },
  256: { color: "#edcc61", fontColor: "#f9f6f2", font: "bold 45px arial" },
  512: { color: "#edc850", fontColor: "#f9f6f2", font: "bold 45px arial" },
  1024: { color: "#edc53f", fontColor: "#f9f6f2", font: "bold 35px arial" },
  2048: { color: "#edc22e", fontColor: "#f9f6f2", font: "bold 35px arial" },
  4096: { color: "black", fontColor: "#f9f6f2", font: "bold 35px arial" },
};

function drawGrid(grid) {
  grid.forEach((row, i) =>
    row.forEach((col, j) => {
      if (grid[j][i] !== 0) {
        let tileColor = properties[grid[j][i]].color;
        let fontColor = properties[grid[j][i]].fontColor;
        let fontProperties = properties[grid[j][i]].font;
        // draw tile background
        ctx.fillStyle = tileColor;
        ctx.fillRect(i * 100 + 10, j * 100 + 10, 90, 90);
        // draw number on a tile
        ctx.fillStyle = fontColor;
        ctx.font = fontProperties;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText(grid[j][i], i * 100 + 10 + 45, j * 100 + 10 + 45);
      }
    })
  );
}
drawGrid(grid);
console.table(grid);

function copyGrid(grid) {
  var copy = grid.map((arr) => arr.slice());
  return copy;
}

function isArrayEqual(arr1, arr2) {
  let equal = true;
  arr1.forEach((row, i) =>
    row.forEach((col, j) => {
      if (arr1[j][i] !== arr2[j][i]) {
        equal = false;
      }
    })
  );
  return equal;
}

function reverseGrid(grid) {
  grid.forEach((row, rowI) => {
    row.reverse();
  });
  return grid;
}

function moveRight(grid) {
  const oldGrid = copyGrid(grid);
  slideRight(grid);
  combineRight(grid);
  slideRight(grid);
  if (!isArrayEqual(oldGrid, grid)) {
    addNewNumber(grid);
  }
  return grid;
}

function moveLeft(grid) {
  const oldGrid = copyGrid(grid);
  reverseGrid(grid);
  slideRight(grid);
  combineRight(grid);
  slideRight(grid);
  reverseGrid(grid);
  if (!isArrayEqual(oldGrid, grid)) {
    addNewNumber(grid);
  }
  return grid;
}

function moveUp(grid) {
  const oldGrid = copyGrid(grid);
  transposeGrid(grid);
  reverseGrid(grid);
  slideRight(grid);
  combineRight(grid);
  slideRight(grid);
  reverseGrid(grid);
  transposeGrid(grid);
  if (!isArrayEqual(oldGrid, grid)) {
    addNewNumber(grid);
  }
}

function moveDown(grid) {
  const oldGrid = copyGrid(grid);
  transposeGrid(grid);
  slideRight(grid);
  combineRight(grid);
  slideRight(grid);
  transposeGrid(grid);
  if (!isArrayEqual(oldGrid, grid)) {
    addNewNumber(grid);
  }
}

function combineRight(grid) {
  grid.forEach((row, rowI) => {
    for (let i = 3; i > 0; i--) {
      if (row[i] == row[i - 1] && row[i] !== 0) {
        grid[rowI][i] = grid[rowI][i] + grid[rowI][i - 1];
        grid[rowI][i - 1] = 0;
      }
    }
    row = [0, 0, 0, 0].concat(row.filter((el) => el !== 0));
    grid[rowI] = row.slice(Math.max(row.length - 4, 0));
    // console.log(row)
  });
  return grid;
}

function slideRight(grid) {
  grid.forEach((row, rowI) => {
    row = [0, 0, 0, 0].concat(row.filter((el) => el !== 0));
    grid[rowI] = row.slice(Math.max(row.length - 4, 0));
  });
  return grid;
}

function transposeGrid(grid) {
  let newGrid = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      newGrid[i][j] = grid[j][i];
    }
  }
  for (let k = 0; k < 4; k++) {
    for (let l = 0; l < 4; l++) {
      grid[k][l] = newGrid[k][l];
    }
  }
  return grid;
}

function updateScreen(grid) {
  ctx.clearRect(0, 0, 400, 400);
  drawStartingGrid();
  drawGrid(grid);
}

// let game = new Game(GAME_WIDTH, GAME_HEIGHT);

let lastTime = 0;
function gameLoop(timestamp) {
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  //   ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  //   game.update(deltaTime);
  //   game.draw(ctx);

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
