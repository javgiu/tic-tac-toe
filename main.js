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

    // Set an id for each cell
    board.forEach(array => array.forEach(cell => cell.setId(board.flat().indexOf(cell))));

    // Search DOM
    const boardContainer = document.querySelector(".board-container");

    const renderBoard = () => {
        boardContainer.innerHTML = "";
        board.forEach(array => array.forEach(cell => {
            const newCell = document.createElement("div");
            newCell.setAttribute("data-id", cell.getId());
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

    const getBoardContainer = () => boardContainer;

    const getCells = () => Array.from(boardContainer.children);


    //  Working here  //
    const changeCellValue = (e, token) => {
        if(e.target.className === "cell") {
            board.forEach( array => {

                const cellToChange = array.find(cell => cell.getId() == e.target.dataset.id);

                if(cellToChange === undefined) {
                    return
                }

                cellToChange.addToken(token);
            })
        }
    };

    const printBoard = () => {
        const boardWithCellValues = board.map(row => row.map(cell => cell.getValue()));
        return boardWithCellValues;
    };

    renderBoard();

    return {getBoard, printBoard, changeCellValue, lines, renderBoard, getBoardContainer, getCells}

}

function Lines() {
    const diagonals = [];
    const verticals = [];
    const horizontals  = [];

    const getHorizontals = (board) => {
        for(let i = 0; i < board.length; i++) {
            horizontals[i] = board[i].map(cell => cell);
        }
        return horizontals ;
    };

    const getVerticals = (board) => {
        const rows = board.length;
        const columns = board[0].length;

        for(let i = 0; i < columns; i++) {
            verticals[i] = [];
            for(let j = 0; j < rows; j++) {
                verticals[i].push(board[j][i]);
            }
        }

        return verticals;
    };

    const getDiagonals = (board) => {
        for(let i = 0; i < 2; i++) {
            diagonals[i] = [];
            if (i === 0) {
                for(let j = 0; j < 3; j++) {
                    diagonals[i].push(board[j][j]);
                }
            } else {
                for(let j = 0, k = 2; j < board.length; j++, k--) {
                    diagonals[i].push(board[j][k]);
                }
            }
        }

        return diagonals;
    };


    return {getHorizontals, getVerticals, getDiagonals};

};

function Cell() {
    let value = 0;
    let id = 0;

    const addToken = (token) => {
        value = token;
    };

    const setId = (newId) => id = newId;

    const getValue = () => value;

    const getId = () => id;

    return {addToken, getValue, setId, getId};
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

    function fireEvent(e) {
            playRound(e, getActivePlayer().token);
    };

    const setEvents = () => {
        board.getBoardContainer().addEventListener("click", fireEvent);
    };

    const removeEvents = () => {
         board.getBoardContainer().removeEventListener("click", fireEvent);
    };

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }; 

    const getActivePlayer = () => activePlayer;

    // const printNewRound = () => {
    //     console.table(board.printBoard());
    //     console.log(`${getActivePlayer().name}'s turn ...`);
    // };
    
    const checkWinner = (array) => {
        array.forEach(array => {
            if(array[0].getValue() === array[1].getValue() && array[0].getValue() === array[2].getValue() && array[0].getValue() !== 0) {
                winner = array[0].getValue();
                console.log("We have a winner " + winner);

                const winnerCells = [];
                for(let i = 0; i < 3; i++) {
                    winnerCells.push(board.getCells().find(cell => cell.dataset.id == array[i].getId()));
                }
                console.log(winnerCells)
                winnerCells.forEach(cell => cell.classList.add("winner"));
                return;
            }
        });
    };

    
    const playRound = (e, token) => {

        if(e.target.classList.contains("x") || e.target.classList.contains("o")) {
            console.log("This cell is full")
            return 0;
        }

        board.changeCellValue(e, getActivePlayer().token);
        board.renderBoard();

        checkWinner(board.lines.getDiagonals(board.getBoard()));
        checkWinner(board.lines.getHorizontals(board.getBoard()));
        checkWinner(board.lines.getVerticals(board.getBoard()));

        if(winner !== null) {
            console.log("Player: " + players.find(player => player.token == winner).name + " wins the entire Game. Play Again?");
            console.table(board.printBoard());
            removeEvents();
            return;
        } else if (!(board.printBoard().flat().includes(0))) {
            console.log("Ties!");
            console.table(board.printBoard());
            return;
        } else {
            switchPlayerTurn();
        }
    };

    setEvents();


    return {getActivePlayer, playRound, board, checkWinner, players};

};

const game = GameController();

// // what I need? 

// Stop the game after someone wins 

// Maybe divide the GameController module in more specific modules