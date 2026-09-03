const ROWS = 9;
const COLS = 9;

const MINES = 10;

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

function createBoard() {
  board = Array.from(
    { length: ROWS },
    () =>
      Array.from({ length: COLS }, () => ({
        hasMine: false,
        revealed: false,
        flagged: false,
        neighbors: 0,
      })),

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

function render() {
  elBoard.innerHTML = "";

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = board[r][c];
      const div = document.createElement("div");

      let classes = "cell";
      if (cell.revealed) classes += " revealed";
      if (cell.revealed && cell.neighbors > 0) {
        classes += ` v${cell.neighbors}`;
        div.textContent = cell.neighbors;
      }
      if (cell.hasMine) div.textContent = "×";
      if (cell.exploded) classes += " exploded";
      div.className = classes;

      if (cell.revealed && cell.hasMine) {
        div.textContent = "✳";
      } else if (cell.revealed && cell.neighbors > 0) {
        div.textContent = cell.neighbors;
      }
      div.className = classes;

      div.dataset.row = r;
      div.dataset.col = c;

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
  }

  reveal(r, c);

  if (board[r][c].hasMine) {
    gameOver = true;
    board[r][c].exploded = true;
    revealAllMines();
  }

  render();
});

createBoard();
render();
