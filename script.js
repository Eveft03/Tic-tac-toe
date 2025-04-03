let cells = document.querySelectorAll(".cell");
let currentPlayerX = true; //Player X first
let reset = document.querySelector("#reset-button");
let msg = document.querySelector(".msg");

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

cells.forEach(function (cell) {
  cell.addEventListener("click", function () {
    if (currentPlayerX) {
      cell.innerHTML = "X";
      currentPlayerX = false;
      cell.disabled = true;
      winner();
    } else {
      cell.innerHTML = "O";
      currentPlayerX = true;
      cell.disabled = true;
      winner();
    }
  });
});

const enableCells = function () {
  for (let cell of cells) {
    cell.disabled = false;
    cell.innerText = " ";
  }
};

const disableCells = function () {
  for (let cell of cells) {
    cell.disabled = true;
  }
};

const shoWinner = function (winner) {
  msg.innerHTML = `Player ${winner} wins!`;
  msg.style.visibility = "visible";
  disableCells();
};

function winner() {
  let win = false;

  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];

    if (
      cells[a].innerText === cells[b].innerText &&
      cells[a].innerText === cells[c].innerText &&
      cells[a].innerText !== " "
    ) {
      win = true;
      shoWinner(cells[a].innerText);
    }
  }

  if (
    !win &&
    [...cells].every(function (cell) {
      return cell.innerText !== " ";
    })
  ) {
    msg.innerHTML = `It's a draw!`;
    msg.style.visibility = "visible";
    disableCells();
  }
}
