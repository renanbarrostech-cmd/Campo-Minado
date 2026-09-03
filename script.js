const ROWS = 9;
const COLS = 9;

const elBoard = document.getElementById("board");

let board = [];

function createBoard() {
  board = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      hasMine: false,
      revealed: false,
      flagged: false,
      neighbors: 0,
    })),
  );
}

function render() {
  elBoard.innerHTML = "";

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = board[r][c];
      const div = document.createElement("div");

      let classes = "cell";
      if (cell.revealed) classes += " revealed";
      div.className = classes;

      div.dataset.row = r;
      div.dataset.col = c;

      elBoard.appendChild(div);
    }
  }
}

elBoard.addEventListener("click", (e) => {
  const target = e.target.closest(".cell");
  if (!target) return;

  const r = Number(target.dataset.row);
  const c = Number(target.dataset.col);

  board[r][c].revealed = true;

  render();
});

createBoard();
render();
