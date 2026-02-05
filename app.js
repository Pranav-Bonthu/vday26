const canvas = document.getElementById("heart-canvas");
const ctx = canvas.getContext("2d");
const leftVines = document.getElementById("left-vines");
const rightVines = document.getElementById("right-vines");
const leftSwan = document.getElementById("left-swan");
const rightSwan = document.getElementById("right-swan");

const pixel = 4;

const colors = {
  outline: "#1f0f15",
  heartLight: "#ff7db1",
  heartMid: "#f24b94",
  heartDark: "#c83a7c",
  highlight: "#ffd8e6",
  vine: "#2c7a3f",
  leaf: "#4fb36a",
  rose: "#e8476b",
  roseDark: "#b83252",
  roseCenter: "#ffd6e4",
  tulip: "#ff7a59",
  tulipDark: "#d4573d",
  tulipCenter: "#ffd1a8",
  swan: "#ffffff",
  swanShade: "#d9d1d6",
  swanWing: "#b9b0b6",
  beak: "#f4a261",
};

function drawPixel(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * pixel, y * pixel, pixel, pixel);
}

function drawHeart() {
  const heartPixels = [
    "....oo....oo....",
    "...oOOo..oOOo...",
    "..oOOOOOOOOOOo..",
    ".oOOOOOOOOOOOOo.",
    "oOOOOOOOOOOOOOOo",
    "oOOOOOOOOOOOOOOo",
    ".oOOOOOOOOOOOOo.",
    "..oOOOOOOOOOOo..",
    "...oOOOOOOOOo...",
    "....oOOOOOOo....",
    ".....oOOOOo.....",
    "......oOOo......",
    ".......oo.......",
  ];

  heartPixels.forEach((row, y) => {
    row.split("").forEach((cell, x) => {
      if (cell === "o") {
        drawPixel(4 + x, 9 + y, colors.outline);
      }
      if (cell === "O") {
        const shade =
          y < 4 ? colors.heartLight : y < 8 ? colors.heartMid : colors.heartDark;
        drawPixel(4 + x, 9 + y, shade);
      }
    });
  });

  const highlight = [
    "..HHH....",
    ".HHH.....",
    "..HH.....",
  ];

  highlight.forEach((row, y) => {
    row.split("").forEach((cell, x) => {
      if (cell === "H") {
        drawPixel(7 + x, 12 + y, colors.highlight);
      }
    });
  });
}

ctx.clearRect(0, 0, canvas.width, canvas.height);
drawHeart();

function drawVines(canvasEl, flip = false) {
  const vineCtx = canvasEl.getContext("2d");
  vineCtx.clearRect(0, 0, canvasEl.width, canvasEl.height);
  const vines = [
    "....v........t....",
    "...vvv......ttt...",
    "..vvv......tTt....",
    ".vvv......rRr.....",
    "..vvv.............",
    "...vvv..l....t....",
    "....vvv.lll.ttt...",
    ".....vvv.lLl.tTt..",
    "......vvv.ll......",
    ".......vvv....r...",
    "........vvv..rrr..",
    ".........vvv.rRr..",
    "....r.....vvv.....",
    "...rrr.....vvv.t..",
    "..rRr.......vvvttt",
    "...rrr........tTt.",
    "....r........vvv..",
    "..........l..vvv..",
    ".........lll.vv...",
    ".........lLl.v....",
    "..........ll......",
  ];

  const rowCount = vines.length;
  const yStep = rowCount + 4;
  for (let offset = 0; offset < canvasEl.height / pixel; offset += yStep) {
    vines.forEach((row, y) => {
      row.split("").forEach((cell, x) => {
        const drawX = flip ? canvasEl.width / pixel - 1 - x : x;
        const drawY = offset + y;
        if (drawY * pixel >= canvasEl.height) {
          return;
        }
        if (cell === "v") {
          vineCtx.fillStyle = colors.vine;
          vineCtx.fillRect(drawX * pixel, drawY * pixel, pixel, pixel);
        }
        if (cell === "l") {
          vineCtx.fillStyle = colors.leaf;
          vineCtx.fillRect(drawX * pixel, drawY * pixel, pixel, pixel);
        }
        if (cell === "L") {
          vineCtx.fillStyle = colors.vine;
          vineCtx.fillRect(drawX * pixel, drawY * pixel, pixel, pixel);
        }
        if (cell === "r") {
          vineCtx.fillStyle = colors.rose;
          vineCtx.fillRect(drawX * pixel, drawY * pixel, pixel, pixel);
        }
        if (cell === "R") {
          vineCtx.fillStyle = colors.roseCenter;
          vineCtx.fillRect(drawX * pixel, drawY * pixel, pixel, pixel);
        }
      if (cell === "t") {
        vineCtx.fillStyle = colors.tulip;
        vineCtx.fillRect(drawX * pixel, drawY * pixel, pixel, pixel);
      }
      if (cell === "T") {
        vineCtx.fillStyle = colors.tulipCenter;
        vineCtx.fillRect(drawX * pixel, drawY * pixel, pixel, pixel);
      }
      });
    });
  }
}

drawVines(leftVines, false);
drawVines(rightVines, true);

function drawSwan(canvasEl, flip = false) {
  const swanCtx = canvasEl.getContext("2d");
  swanCtx.clearRect(0, 0, canvasEl.width, canvasEl.height);
  const swanPixels = [
    ".....ss...........",
    "....swws..........",
    "...swwwws.........",
    "..swwwwbww........",
    "..swwwwwww........",
    "..swwwwwwww.......",
    ".swwwwwwwwww......",
    ".swwwwwwwwwww.....",
    "..swwwwwwwwwws....",
    "...swwwwwwwwws....",
    "....swwwwwwwws....",
    ".....swwwwwwws....",
    "......swwwwws.....",
    ".......swwws......",
    "........sws.......",
  ];

  swanPixels.forEach((row, y) => {
    const cells = flip ? row.split("").reverse() : row.split("");
    cells.forEach((cell, x) => {
      if (cell === "w") {
        swanCtx.fillStyle = y < 3 ? colors.swanShade : colors.swan;
        swanCtx.fillRect(x * pixel, y * pixel, pixel, pixel);
      }
      if (cell === "s") {
        swanCtx.fillStyle = colors.swanWing;
        swanCtx.fillRect(x * pixel, y * pixel, pixel, pixel);
      }
      if (cell === "b") {
        swanCtx.fillStyle = colors.beak;
        swanCtx.fillRect(x * pixel, y * pixel, pixel, pixel);
      }
    });
  });
}

drawSwan(leftSwan, false);
drawSwan(rightSwan, true);

canvas.addEventListener("click", () => {
  window.location.href = "next.html";
});
