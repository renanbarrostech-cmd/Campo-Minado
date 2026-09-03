const ROWS = 9
const COLS = 9

const elBoard = document.getElementById("board")

let board = []

function createBoard() {
  board = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      hasMine: false,
      revealed: false,
      flagged: false,
      neighbors: 0,
    }))
  );
}

function render() {
  elBoard.innerHTML = "";

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const div = document.createElement("div");
      div.className = "cell";
      div.dataset.row = r;
      div.dataset.col = c;
      elBoard.appendChild(div);
    }
  }
}

createBoard();
render();