document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("board");
    const resetButton = document.getElementById("reset");
    const leaderboard = document.querySelector("#leaderboard tbody");
    const clearButton = document.getElementById("clearLeaderboard");
    let currentPlayer = "X";
    let startTime;
    let timer;

    const createBoard = () => {
        board.innerHTML = "";
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement("div");
            cell.dataset.index = i;
            cell.addEventListener("click", onCellClick, { once: true });
            board.appendChild(cell);
        }
    };

    const onCellClick = (e) => {
        if (!startTime) {
            startTime = Date.now();
            timer = setInterval(updateTime, 1000);
        }
        e.target.textContent = currentPlayer;
        if (checkWin()) {
            clearInterval(timer);
            if (currentPlayer === "X") {
                const playerName = prompt("¡Has ganado! Ingresa tu nombre:");
                if (playerName) {
                    saveTime(playerName, Date.now() - startTime);
                    displayLeaderboard();
                }
            }
        } else {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            if (currentPlayer === "O") {
                computerMove();
            }
        }
    };

    const computerMove = () => {
        const emptyCells = Array.from(board.children).filter(cell => !cell.textContent);
        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            randomCell.textContent = "O";
            randomCell.removeEventListener("click", onCellClick);
            if (checkWin()) {
                clearInterval(timer);
            } else {
                currentPlayer = "X";
            }
        }
    };

    const checkWin = () => {
        const winPatterns = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            return board.children[a].textContent &&
                board.children[a].textContent === board.children[b].textContent &&
                board.children[a].textContent === board.children[c].textContent;
        });
    };

    const saveTime = (name, time) => {
        const times = JSON.parse(localStorage.getItem("times")) || [];
        const date = new Date();
        times.push({ name, time, date: date.toLocaleDateString(), hour: date.toLocaleTimeString() });
        times.sort((a, b) => a.time - b.time);
        if (times.length > 10) times.pop();
        localStorage.setItem("times", JSON.stringify(times));
    };

    const displayLeaderboard = () => {
        const times = JSON.parse(localStorage.getItem("times")) || [];
        leaderboard.innerHTML = times.map((entry, index) =>
            `<tr>
                <td>${index + 1}</td>
                <td>${entry.name}</td>
                <td>${(entry.time / 1000).toFixed(2)}</td>
                <td>${entry.date}</td>
                <td>${entry.hour}</td>
            </tr>`
        ).join("");
    };

    const updateTime = () => {
        const currentTime = Math.floor((Date.now() - startTime) / 1000);
        console.log(`Tiempo: ${currentTime}s`);
    };

    resetButton.addEventListener("click", () => {
        clearInterval(timer);
        startTime = null;
        currentPlayer = "X";
        createBoard();
    });

    clearButton.addEventListener("click", () => {
        localStorage.removeItem("times");
        displayLeaderboard();
    });

    createBoard();
    displayLeaderboard();
});