function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    // Filling board with cells
    for(let i = 0; i < rows; i++) {
        board[i] = [];
        for(let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const boardContainer = document.querySelector(".board-container");

    const renderBoard = () => {
        boardContainer.innerHTML = "";
        board.forEach(array => array.forEach(cell => {
            const newCell = document.createElement("div");
            newCell.className = "cell";
            if(cell.getValue() === "X") {
                newCell.classList.add("x");
            }
            if(cell.getValue() === "O") {
                newCell.classList.add("o");
            }
            boardContainer.appendChild(newCell);

        }));
    };

    const lines = Lines();

    const getBoard = () => board;

    const changeCellValue = (row, column, token) => {
        board[row][column].addToken(token);
    };

    const printBoard = () => {
        const boardWithCellValues = board.map(row => row.map(cell => cell.getValue()));
        return boardWithCellValues;
    };

    renderBoard();


    return {getBoard, printBoard, changeCellValue, lines, renderBoard}

}
// // Working here // 
function Lines() {
    const diagonals = [];
    const verticals = [];
    const horizontals  = [];

    const getHorizontals = (board) => {
        for(let i = 0; i < board.length; i++) {
            horizontals[i] = board[i].map(cell => cell.getValue());
        }
        return horizontals ;
    };

    const getVerticals = (board) => {
        const rows = board.length;
        const columns = board[0].length;

        for(let i = 0; i < columns; i++) {
            verticals[i] = [];
            for(let j = 0; j < rows; j++) {
                verticals[i].push(board[j][i].getValue());
            }
        }

        return verticals;
    };

    const getDiagonals = (board) => {
        for(let i = 0; i < 2; i++) {
            diagonals[i] = [];
            if (i === 0) {
                for(let j = 0; j < 3; j++) {
                    diagonals[i].push(board[j][j].getValue());
                }
            } else {
                for(let j = 0, k = 2; j < board.length; j++, k--) {
                    diagonals[i].push(board[j][k].getValue());
                }
            }
        }

        return diagonals;
    };


    return {getHorizontals, getVerticals, getDiagonals};

};

function Cell() {
    let value = 0;

    // Way to select cell when click it
    // let id = 0;

    // const setId = () => id = 

    const addToken = (token) => {
        value = token;
    };

    const getValue = () => value;

    return {addToken, getValue};
}

function GameController(
    playerOneName = "Player 1", 
    playerTwoName = "Player 2"
) {
    const board = Gameboard();
    
    const players = [
        {
            name: playerOneName,
            token: "X",
        },
        {
            name: playerTwoName,
            token: "O",
        }
    ];

    let winner = null;

    let activePlayer = players[0];

    // Trying to set the events 
    // const setEvents = () => {

    // };

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }; 

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        console.table(board.printBoard());
        console.log(`${getActivePlayer().name}'s turn ...`);
    };

    // Working on that //
    
    const checkWinner = (array) => {
        array.forEach(array => {
            if(array[0] === array[1] && array[0] === array[2] && array[0] !== 0) {
                winner = array[0];
                console.log("We have a winner " + winner);
                return;
            }
        });
    };


    const playRound = (row, column) => {
        console.log(
            `${getActivePlayer().name} plays in (${row}, ${column})`
        );

        if(board.printBoard()[row][column] !== 0) {
            console.log("This cell is full")
            return 0;
        }

        board.changeCellValue(row, column, getActivePlayer().token);

        checkWinner(board.lines.getDiagonals(board.getBoard()));
        checkWinner(board.lines.getHorizontals(board.getBoard()));
        checkWinner(board.lines.getVerticals(board.getBoard()))

        if(winner !== null) {
            console.log("Player: " + players.find(player => player.token == winner).name + " wins the entire Game. Play Again?");
           console.table(board.printBoard());

            return;
        } else if (!(board.printBoard().flat().includes(0))) {
            console.log("Ties!")
            console.table(board.printBoard());
            
            return;
        } else {
            board.renderBoard();
            switchPlayerTurn();
            printNewRound();
        }

    };

    printNewRound();



return {getActivePlayer, playRound, board, checkWinner, players};

};

const game = GameController();

// // what I need? 

// Stop the game after someone wins 

// Maybe divide the GameController module in more specific modules