document.addEventListener("DOMContentLoaded", function () {
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
      if (cell.innerText === "") {
        // Only allow moves on empty cells
        if (currentPlayerX) {
          cell.innerText = "X";
          currentPlayerX = false;
        } else {
          cell.innerText = "O";
          currentPlayerX = true;
        }
        cell.disabled = true; // Disable the cell after move
        checkWinner(); // Check for winner after each move
      }
    });
  });

  const enableCells = function () {
    for (let cell of cells) {
      cell.classList.remove("disabled", "winner-cell");
      cell.style.pointerEvents = "auto"; // Enable pointer events
      cell.innerText = "";
    }
  };

  const disableCells = function () {
    for (let cell of cells) {
      cell.classList.add("disabled");
      cell.style.pointerEvents = "none"; // Disable pointer events
    }
  };

  const showWinner = function (winner, winningCells) {
    msg.innerText = `Player ${winner} wins!`;
    msg.classList.remove("hide");

    // Highlight winning cells
    winningCells.forEach(function (index) {
      cells[index].classList.add("winner-cell");
    });

    disableCells();
  };

  function checkWinner() {
    let win = false;

    // Check for winning combinations
    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      const pos1 = cells[a].innerText;
      const pos2 = cells[b].innerText;
      const pos3 = cells[c].innerText;

      if (pos1 !== "" && pos1 === pos2 && pos2 === pos3) {
        showWinner(pos1, [a, b, c]);
        win = true;
        disableCells();
        return;
      }
    }

    // Check for draw
    const isDraw = [...cells].every((cell) => cell.innerText !== "");
    if (!win && isDraw) {
      msg.innerText = "It's a draw!";
      msg.classList.remove("hide");
      disableCells();
    }
  }

  // Reset button
  reset.addEventListener("click", function () {
    enableCells();
    currentPlayerX = true;
    msg.classList.add("hide");
  });
});
