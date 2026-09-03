const ROWS = 9;
const COLS = 9;

const MINES = 10;

const elMessage = document.getElementById("message");
const elCounter = document.getElementById("counter");
const elTimer = document.getElementById("timer");

const DIRECTIONS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

function inside(r, c) {
  return r >= 0 && r < ROWS && c >= 0 && c < COLS;
}

const elBoard = document.getElementById("board");

let board = [];
let firstClick = true;
let gameOver = false;
let flagsPlaced = 0;
let seconds = 0;
let timerId = null;

function createBoard() {
  board = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      hasMine: false,
      revealed: false,
      flagged: false,
      exploded: false,
      neighbors: 0,
    })),
  );
}
function placeMines(safeRow, safeCol) {
  let placed = 0;

  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);

    if (board[r][c].hasMine) continue;

    const isSafeZone = Math.abs(r - safeRow) <= 1 && Math.abs(c - safeCol) <= 1;
    if (isSafeZone) continue;

    board[r][c].hasMine = true;
    placed++;
  }
}

function countNeighbors() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c].hasMine) continue;

      let total = 0;
      for (const [dr, dc] of DIRECTIONS) {
        const nr = r + dr;
        const nc = c + dc;
        if (inside(nr, nc) && board[nr][nc].hasMine) total++;
      }

      board[r][c].neighbors = total;
    }
  }
}

function reveal(r, c) {
  if (!inside(r, c)) return;

  const cell = board[r][c];
  if (cell.revealed || cell.flagged) return;

  cell.revealed = true;

  if (cell.hasMine) return;
  if (cell.neighbors > 0) return;

  for (const [dr, dc] of DIRECTIONS) {
    reveal(r + dr, c + dc);
  }
}

function revealAllMines() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c].hasMine) {
        board[r][c].revealed = true;
        board[r][c].flagged = false;
      }
    }
  }
}

function checkWin() {
  let revealedCount = 0;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c].revealed && !board[r][c].hasMine) revealedCount++;
    }
  }

  return revealedCount === ROWS * COLS - MINES;
}

function format(n) {
  return String(Math.max(0, Math.min(999, n))).padStart(3, "0");
}

function updateHUD() {
  elCounter.textContent = format(MINES - flagsPlaced);
  elTimer.textContent = format(seconds);
}

function startTimer() {
  timerId = setInterval(() => {
    seconds++;
    updateHUD();
    if (seconds >= 999) stopTimer();
  }, 1000);
}

function stopTimer() {
  clearInterval(timerId);
  timerId = null;
}

function render() {
  elBoard.innerHTML = "";

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = board[r][c];
      const div = document.createElement("div");

      let classes = "cell";
      if (cell.revealed) classes += " revealed";
      if (cell.flagged && !cell.revealed) classes += " flag";
      if (cell.exploded) classes += " exploded";
      if (cell.revealed && !cell.hasMine && cell.neighbors > 0) {
        classes += ` v${cell.neighbors}`;
      }
      div.className = classes;

      div.dataset.row = r;
      div.dataset.col = c;

      if (cell.flagged && !cell.revealed) {
        div.textContent = "⚑";
      } else if (cell.revealed && cell.hasMine) {
        div.textContent = "✳";
      } else if (cell.revealed && cell.neighbors > 0) {
        div.textContent = cell.neighbors;
      }

      elBoard.appendChild(div);
    }
  }
}

elBoard.addEventListener("click", (e) => {
  if (gameOver) return;

  const target = e.target.closest(".cell");
  if (!target) return;

  const r = Number(target.dataset.row);
  const c = Number(target.dataset.col);

  if (firstClick) {
    placeMines(r, c);
    countNeighbors();
    firstClick = false;
    startTimer();
  }

  reveal(r, c);

    if (board[r][c].hasMine) {
    gameOver = true;
    board[r][c].exploded = true;
    revealAllMines();
    elMessage.textContent = "Você perdeu. Tente de novo.";
    stopTimer();
  } else if (checkWin()) {
    gameOver = true;
    elMessage.textContent = "Você venceu!";
    stopTimer();
  }

  render();
  updateHUD();
});

elBoard.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  if (gameOver || firstClick) return;

  const target = e.target.closest(".cell");
  if (!target) return;

  const cell = board[Number(target.dataset.row)][Number(target.dataset.col)];
  if (cell.revealed) return;

  cell.flagged = !cell.flagged;
  flagsPlaced += cell.flagged ? 1 : -1;

  render();
  updateHUD();
});

createBoard();
render();
updateHUD();
