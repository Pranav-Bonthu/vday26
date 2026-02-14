const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const warningEl = document.getElementById("warning");
const continueBtn = document.getElementById("continue");
const resetBtn = document.getElementById("reset");
const confettiEl = document.getElementById("confetti");

const palette = {
  P: "#e6a4c6",
  Pe: "#f7c58d",
  C: "#ff7a6e",
  B: "#9bbcff",
  G: "#b9df9a",
  T: "#b8ad98",
  Y: "#e7f38d",
  Gr: "#e2e2e2",
  Pu: "#b9a2e8",
};

const grid = [
  ["P", "P", "P", "P", "P", "P", "P", "P", "P"],
  ["P", "Pe", "Pe", "Pe", "Pe", "B", "B", "P", "G"],
  ["P", "Pe", "Pe", "C", "Pe", "C", "B", "P", "G"],
  ["P", "Pe", "C", "C", "C", "C", "C", "G", "G"],
  ["Pe", "Pe", "C", "C", "C", "C", "C", "G", "G"],
  ["T", "T", "Y", "C", "C", "C", "Gr", "Pu", "G"],
  ["T", "T", "Y", "Y", "C", "Gr", "Gr", "Pu", "G"],
  ["Pu", "T", "T", "Pu", "Pu", "Pu", "Pu", "Pu", "G"],
  ["Pu", "Pu", "Pu", "Pu", "G", "G", "G", "G", "G"],
];

const state = {
  marks: Array.from({ length: 9 }, () => Array(9).fill(0)), // 0 empty, 1 X, 2 queen
  cells: Array.from({ length: 9 }, () => Array(9).fill(null)),
  buttons: Array.from({ length: 9 }, () => Array(9).fill(null)),
};

function updateStatus(message) {
  statusEl.textContent = message;
}

function queenCount() {
  return state.marks.flat().filter((value) => value === 2).length;
}

function countQueensInRow(row) {
  return state.marks[row].filter((value) => value === 2).length;
}

function countQueensInCol(col) {
  return state.marks.reduce((sum, row) => sum + (row[col] === 2 ? 1 : 0), 0);
}

function countQueensInColor(colorKey) {
  let count = 0;
  for (let r = 0; r < 9; r += 1) {
    for (let c = 0; c < 9; c += 1) {
      if (state.marks[r][c] === 2 && grid[r][c] === colorKey) {
        count += 1;
      }
    }
  }
  return count;
}

function hasAdjacentQueens() {
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];
  for (let r = 0; r < 9; r += 1) {
    for (let c = 0; c < 9; c += 1) {
      if (state.marks[r][c] !== 2) continue;
      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nr >= 9 || nc < 0 || nc >= 9) continue;
        if (state.marks[nr][nc] === 2) {
          return true;
        }
      }
    }
  }
  return false;
}

function buildConflictMap() {
  const conflict = Array.from({ length: 9 }, () => Array(9).fill(false));
  const conflicts = new Set();

  for (let r = 0; r < 9; r += 1) {
    if (countQueensInRow(r) > 1) {
      conflicts.add("row");
      for (let c = 0; c < 9; c += 1) {
        conflict[r][c] = true;
      }
    }
  }

  for (let c = 0; c < 9; c += 1) {
    if (countQueensInCol(c) > 1) {
      conflicts.add("column");
      for (let r = 0; r < 9; r += 1) {
        conflict[r][c] = true;
      }
    }
  }

  const colors = new Set(grid.flat());
  for (const color of colors) {
    if (countQueensInColor(color) > 1) {
      conflicts.add("color");
      for (let r = 0; r < 9; r += 1) {
        for (let c = 0; c < 9; c += 1) {
          if (grid[r][c] === color) {
            conflict[r][c] = true;
          }
        }
      }
    }
  }

  if (hasAdjacentQueens()) {
    conflicts.add("adjacent");
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];
    for (let r = 0; r < 9; r += 1) {
      for (let c = 0; c < 9; c += 1) {
        if (state.marks[r][c] !== 2) continue;
        for (const [dr, dc] of directions) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr < 0 || nr >= 9 || nc < 0 || nc >= 9) continue;
          if (state.marks[nr][nc] === 2) {
            conflict[r][c] = true;
            conflict[nr][nc] = true;
          }
        }
      }
    }
  }

  return { conflict, conflicts };
}

function updateWarning() {
  const { conflicts } = buildConflictMap();
  if (conflicts.size === 0) {
    warningEl.textContent = "No conflicts.";
    warningEl.classList.add("ok");
  } else {
    warningEl.textContent = `⚠ Conflicts: ${Array.from(conflicts).join(", ")}`;
    warningEl.classList.remove("ok");
  }
}

function checkWin() {
  if (queenCount() !== 9) {
    return false;
  }
  for (let i = 0; i < 9; i += 1) {
    if (countQueensInRow(i) !== 1 || countQueensInCol(i) !== 1) {
      return false;
    }
  }
  const colors = new Set(grid.flat());
  for (const color of colors) {
    if (countQueensInColor(color) !== 1) {
      return false;
    }
  }
  if (hasAdjacentQueens()) {
    return false;
  }
  if (buildConflictMap().conflicts.size > 0) {
    return false;
  }
  return true;
}

function setButtonState(buttonEl, stateValue) {
  buttonEl.classList.remove("queen", "mark-x");
  if (stateValue === 1) {
    buttonEl.textContent = "✕";
    buttonEl.classList.add("mark-x");
  } else if (stateValue === 2) {
    buttonEl.textContent = "♛";
    buttonEl.classList.add("queen");
  } else {
    buttonEl.textContent = "";
  }
}

function renderBoard() {
  const { conflict } = buildConflictMap();
  for (let r = 0; r < 9; r += 1) {
    for (let c = 0; c < 9; c += 1) {
      setButtonState(state.buttons[r][c], state.marks[r][c]);
      if (conflict[r][c]) {
        state.cells[r][c].classList.add("conflict");
      } else {
        state.cells[r][c].classList.remove("conflict");
      }
    }
  }
}

function toggleMark(row, col) {
  const current = state.marks[row][col];
  if (current === 0) {
    state.marks[row][col] = 1;
    updateStatus("Marked with X.");
    updateWarning();
    renderBoard();
    return;
  }
  if (current === 1) {
    state.marks[row][col] = 2;
  } else {
    state.marks[row][col] = 0;
  }

  if (checkWin()) {
    updateStatus("You did it! All queens placed correctly.");
    continueBtn.hidden = false;
    launchConfetti();
  } else {
    updateStatus(`Queens placed: ${queenCount()} / 9`);
    continueBtn.hidden = true;
  }
  updateWarning();
  renderBoard();
}

function buildBoard() {
  boardEl.innerHTML = "";
  grid.forEach((row, r) => {
    row.forEach((colorKey, c) => {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.style.setProperty("--cell-color", palette[colorKey]);

      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute("aria-label", `Row ${r + 1}, column ${c + 1}`);
      button.addEventListener("click", () => toggleMark(r, c));

      cell.appendChild(button);
      boardEl.appendChild(cell);
      state.cells[r][c] = cell;
      state.buttons[r][c] = button;
    });
  });
  renderBoard();
}

function resetBoard() {
  state.marks = Array.from({ length: 9 }, () => Array(9).fill(0));
  buildBoard();
  updateStatus("Board reset.");
  updateWarning();
  continueBtn.hidden = true;
  confettiEl.innerHTML = "";
}

resetBtn.addEventListener("click", resetBoard);
continueBtn.addEventListener("click", () => {
  window.location.href = "queens-finish.html";
});

buildBoard();
updateStatus("Place 9 queens. One per row, column, and color.");
updateWarning();

function launchConfetti() {
  confettiEl.innerHTML = "";
  const colors = ["#f24b94", "#ffd166", "#8ecae6", "#9bd49f", "#cdb4db"];
  const pieces = 60;
  for (let i = 0; i < pieces; i += 1) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[i % colors.length];
    piece.style.animationDelay = `${Math.random() * 0.6}s`;
    piece.style.transform = `translateY(0) rotate(${Math.random() * 360}deg)`;
    confettiEl.appendChild(piece);
  }
}
