document.addEventListener("DOMContentLoaded", function () {
  let cells = document.querySelectorAll(".cell");
  let currentPlayerX = true; //Player X first
  let restart = document.querySelector("#restart-button");
  let ResetGame = document.querySelector("#resetGame-button");
  let msg = document.querySelector(".msg");
  let darkModeToggle = document.querySelector("#dark-mode-toggle");
  darkModeToggle.innerText = "ִֶָ☾";
  let loadSavesBtn = document.querySelector("#loadSaves-button");
  let saveBtn = document.querySelector("#Save-button");
  let PX = document.querySelector("#PX");
  let PO = document.querySelector("#PO");
  let tie = document.querySelector("#TIE");

  // Initialize scores
  let XScore = 0;
  let OScore = 0;
  let tieScore = 0;

  loadScores();

  // Save button functionality
  saveBtn.addEventListener("click", function() {
    // Get current board state
    const boardState = [];
    cells.forEach(cell => {
      boardState.push(cell.innerText);
    });
    
    // Create game state object
    const gameState = {
      board: boardState,
      currentPlayerX: currentPlayerX,
      scores: {
        x: XScore,
        o: OScore,
        tie: tieScore
      },
      gameOver: !msg.classList.contains('hide')
    };
    
    // Save to localStorage with timestamp
    const timestamp = new Date().toLocaleString();
    const saveKey = "tictactoe_save_" + Date.now();
    
    // Get existing save list or create new one
    let saveList = JSON.parse(localStorage.getItem("tictactoe_saves") || "[]");
    saveList.push({
      key: saveKey,
      timestamp: timestamp
    });
    
    // Save both the list and the game state
    localStorage.setItem("tictactoe_saves", JSON.stringify(saveList));
    localStorage.setItem(saveKey, JSON.stringify(gameState));
    
    // Show confirmation
    msg.innerText = "Game saved!";
    msg.classList.remove("hide");
    setTimeout(function() {
      msg.classList.add("hide");
    }, 2000);
  });

  // Load saves button functionality
  loadSavesBtn.addEventListener("click", function() {
    // Get the list of saves
    const saveList = JSON.parse(localStorage.getItem("tictactoe_saves") || "[]");
    
    if (saveList.length === 0) {
      msg.innerText = "No saved games found!";
      msg.classList.remove("hide");
      setTimeout(function() {
        msg.classList.add("hide");
      }, 2000);
      return;
    }
    
    // Create a modal to display the saves
    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.left = "0";
    modal.style.top = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.backgroundColor = "rgba(0,0,0,0.7)";
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.zIndex = "1000";
    
    const modalContent = document.createElement("div");
    modalContent.style.backgroundColor = document.body.classList.contains("dark-mode") ? "#333" : "#fff";
    modalContent.style.borderRadius = "10px";
    modalContent.style.padding = "20px";
    modalContent.style.maxWidth = "80%";
    modalContent.style.maxHeight = "80%";
    modalContent.style.overflowY = "auto";
    modalContent.style.color = "#ec88e7";
    modalContent.style.fontFamily = "'Permanent Marker', cursive";
    
    const title = document.createElement("h2");
    title.textContent = "Saved Games";
    title.style.color = "#ec88e7";
    title.style.textAlign = "center";
    
    modalContent.appendChild(title);
    
    // Add each save to the modal
    saveList.forEach(function(save) {
      const saveItem = document.createElement("div");
      saveItem.style.padding = "10px";
      saveItem.style.margin = "10px 0";
      saveItem.style.border = "1px solid #8a6e85";
      saveItem.style.borderRadius = "5px";
      
      const saveTime = document.createElement("p");
      saveTime.textContent = "Saved: " + save.timestamp;
      saveTime.style.margin = "0 0 10px 0";
      
      const buttonContainer = document.createElement("div");
      buttonContainer.style.display = "flex";
      buttonContainer.style.justifyContent = "space-between";
      
      const loadButton = document.createElement("button");
      loadButton.textContent = "Load";
      loadButton.style.padding = "5px 10px";
      loadButton.style.cursor = "pointer";
      loadButton.style.borderRadius = "5px";
      loadButton.style.border = "1px solid #8a6e85";
      loadButton.style.backgroundColor = document.body.classList.contains("dark-mode") ? "#a0a0a0" : "#ffffff";
      
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.style.padding = "5px 10px";
      deleteButton.style.cursor = "pointer";
      deleteButton.style.borderRadius = "5px";
      deleteButton.style.border = "1px solid #8a6e85";
      deleteButton.style.backgroundColor = document.body.classList.contains("dark-mode") ? "#a0a0a0" : "#ffffff";
      
      buttonContainer.appendChild(loadButton);
      buttonContainer.appendChild(deleteButton);
      
      saveItem.appendChild(saveTime);
      saveItem.appendChild(buttonContainer);
      
      modalContent.appendChild(saveItem);
      
      // Load game functionality
      loadButton.addEventListener("click", function() {
        const savedGame = JSON.parse(localStorage.getItem(save.key));
        if (savedGame) {
          // Load the board state
          cells.forEach((cell, index) => {
            cell.innerText = savedGame.board[index] || "";
          });
          
          // Load scores
          XScore = savedGame.scores.x || 0;
          OScore = savedGame.scores.o || 0;
          tieScore = savedGame.scores.tie || 0;
          updateScoreDisplay();
          
          // Set current player
          currentPlayerX = savedGame.currentPlayerX;
          
          // Check if game was over
          if (savedGame.gameOver) {
            checkWinner(); // This will handle displaying the winner state
          } else {
            msg.classList.add("hide");
            enableCells();
            // Disable cells that are already filled
            cells.forEach(cell => {
              if (cell.innerText !== "") {
                cell.classList.add("disabled");
                cell.style.pointerEvents = "none";
              }
            });
          }
          
          // Close the modal
          document.body.removeChild(modal);
        }
      });
      
      // Delete save functionality
      deleteButton.addEventListener("click", function() {
        // Remove the save from the list
        const updatedSaveList = saveList.filter(s => s.key !== save.key);
        localStorage.setItem("tictactoe_saves", JSON.stringify(updatedSaveList));
        
        // Remove the save data
        localStorage.removeItem(save.key);
        
        // Remove the save item from the modal
        modalContent.removeChild(saveItem);
        
        // If no saves left, display message
        if (updatedSaveList.length === 0) {
          const noSavesMsg = document.createElement("p");
          noSavesMsg.textContent = "No saved games available";
          noSavesMsg.style.textAlign = "center";
          modalContent.appendChild(noSavesMsg);
        }
      });
    });
    
    // Add close button
    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.style.padding = "10px 20px";
    closeButton.style.marginTop = "20px";
    closeButton.style.display = "block";
    closeButton.style.margin = "20px auto 0";
    closeButton.style.fontFamily = "'Permanent Marker', cursive";
    closeButton.style.cursor = "pointer";
    closeButton.style.borderRadius = "10px";
    closeButton.style.border = "1px solid #8a6e85";
    closeButton.style.backgroundColor = document.body.classList.contains("dark-mode") ? "#a0a0a0" : "#ffffff";
    
    closeButton.addEventListener("click", function() {
      document.body.removeChild(modal);
    });
    
    modalContent.appendChild(closeButton);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
  });

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

    if (winner === "X") {
      XScore++;
      PX.textContent = `Player X: ${XScore}`;
    } else if (winner === "O") {
      OScore++;
      PO.textContent = `Player O: ${OScore}`;
    }

    saveScores();

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
      tieScore++;
      tie.textContent = `Ties: ${tieScore}`;
      saveScores();
    }
  }

  // Reset button
  restart.addEventListener("click", function () {
    enableCells();
    currentPlayerX = true;
    msg.classList.add("hide");
  });

  // Reset game button
  ResetGame.addEventListener("click", function () {
    enableCells();
    currentPlayerX = true;
    msg.classList.add("hide");
    XScore = 0;
    OScore = 0;
    tieScore = 0;
    updateScoreDisplay();
    saveScores();
  });

  // Toggle dark mode
  darkModeToggle.addEventListener("click", function () {
    let element = document.body;
    element.classList.toggle("dark-mode");
    const isDarkMode = element.classList.contains("dark-mode");
    darkModeToggle.innerText = isDarkMode ? "❂" : "ִֶָ☾";
  });

  // Functions for saving and loading scores
  function saveScores() {
    localStorage.setItem(
      "tictactoeScores",
      JSON.stringify({
        x: XScore,
        o: OScore,
        tie: tieScore,
      })
    );
  }

  function loadScores() {
    const savedScores = localStorage.getItem("tictactoeScores");
    if (savedScores) {
      const scores = JSON.parse(savedScores);
      XScore = scores.x || 0;
      OScore = scores.o || 0;
      tieScore = scores.tie || 0;
      updateScoreDisplay();
    }
  }

  function updateScoreDisplay() {
    PX.textContent = `Player X: ${XScore}`;
    PO.textContent = `Player O: ${OScore}`;
    tie.textContent = `Ties: ${tieScore}`;
  }

  // Initialize score display
  updateScoreDisplay();
});