const board = document.getElementById("board");
const statusText = document.getElementById("status");
let currentPlayer = "X";
let playerSymbol = "X";
let aiSymbol = "O";
let difficulty = "easy";
let cells = ["", "", "", "", "", "", "", "", ""];

function setDifficulty() {
    difficulty = document.getElementById("difficulty").value;
}

function setPlayerSymbol() {
    playerSymbol = document.getElementById("playerChoice").value;
    aiSymbol = playerSymbol === "X" ? "O" : "X";
    resetGame();
}

function createBoard() {
    board.innerHTML = "";
    cells.forEach((cell, index) => {
        const cellElement = document.createElement("div");
        cellElement.classList.add("cell");
        cellElement.dataset.index = index;
        cellElement.textContent = cell;
        cellElement.addEventListener("click", handleMove);
        board.appendChild(cellElement);
    });
}

function handleMove(event) {
    const index = event.target.dataset.index;
    if (cells[index] || checkWinner() || currentPlayer !== playerSymbol) return;

    cells[index] = currentPlayer;
    event.target.textContent = currentPlayer;
    event.target.classList.add("taken");

    if (checkWinner()) {
        statusText.textContent = `Gracz ${currentPlayer} wygrywa!`;
        return;
    }

    currentPlayer = aiSymbol;
    if (currentPlayer === aiSymbol) {
        setTimeout(aiMove, 500);
    }
}

function aiMove() {
    let move;
    if (difficulty === "easy") {
        move = getRandomMove();
    } else if (difficulty === "medium") {
        move = getBestMoveMedium();
    } else {
        move = getBestMoveHard();
    }

    if (move !== null) {
        cells[move] = aiSymbol;
        document.querySelector(`[data-index='${move}']`).textContent = aiSymbol;
        document.querySelector(`[data-index='${move}']`).classList.add("taken");

        if (checkWinner()) {
            statusText.textContent = `Gracz ${aiSymbol} wygrywa!`;
            return;
        }

        currentPlayer = playerSymbol;
    }
}

function getRandomMove() {
    let emptyCells = cells.map((cell, index) => (cell === "" ? index : null)).filter(index => index !== null);
    return emptyCells.length ? emptyCells[Math.floor(Math.random() * emptyCells.length)] : null;
}

function getBestMoveMedium() {

    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
        let [a, b, c] = pattern;
        if (cells[a] === aiSymbol && cells[b] === aiSymbol && !cells[c]) return c;
        if (cells[a] === aiSymbol && cells[c] === aiSymbol && !cells[b]) return b;
        if (cells[b] === aiSymbol && cells[c] === aiSymbol && !cells[a]) return a;
    }

    for (let pattern of winPatterns) {
        let [a, b, c] = pattern;
        if (cells[a] === playerSymbol && cells[b] === playerSymbol && !cells[c]) return c;
        if (cells[a] === playerSymbol && cells[c] === playerSymbol && !cells[b]) return b;
        if (cells[b] === playerSymbol && cells[c] === playerSymbol && !cells[a]) return a;
    }

    return getRandomMove();
}

function getBestMoveHard() {
    return minimax(cells, aiSymbol).index;
}

function minimax(newBoard, player) {
    let emptyCells = newBoard.map((cell, index) => (cell === "" ? index : null)).filter(index => index !== null);

    if (checkWinnerAI(newBoard, playerSymbol)) return { score: -10 };
    if (checkWinnerAI(newBoard, aiSymbol)) return { score: 10 };
    if (emptyCells.length === 0) return { score: 0 };

    let moves = [];

    for (let i of emptyCells) {
        let move = {};
        move.index = i;
        newBoard[i] = player;

        if (player === aiSymbol) {
            move.score = minimax(newBoard, playerSymbol).score;
        } else {
            move.score = minimax(newBoard, aiSymbol).score;
        }

        newBoard[i] = "";
        moves.push(move);
    }

    let bestMove;
    if (player === aiSymbol) {
        let bestScore = -Infinity;
        for (let m of moves) {
            if (m.score > bestScore) {
                bestScore = m.score;
                bestMove = m;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let m of moves) {
            if (m.score < bestScore) {
                bestScore = m.score;
                bestMove = m;
            }
        }
    }
    return bestMove;
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return cells[a] && cells[a] === cells[b] && cells[a] === cells[c];
    });
}

function checkWinnerAI(board, player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return board[a] === player && board[b] === player && board[c] === player;
    });
}

function resetGame() {
    cells = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = playerSymbol;
    statusText.textContent = "";
    createBoard();

    if (currentPlayer === aiSymbol) {
        setTimeout(aiMove, 500);
    }
}

createBoard();
