 export default class Game {
    constructor(size) {
        this.size = size;
        this.moveArray = [];
        this.winArray = [];
        this.loseArray = [];
        this.gameState = {
            board: [],
            score: 0,
            won: false,
            over: false
        }
        for (var i = 0; i < size; i++) {
            this.gameState.board[i] = [];
            for (var j = 0; j < size; j++) {
                this.gameState.board[i][j] = 0;
            }
        }
        this.placeNumber();
        this.placeNumber();

    }

    placeNumber() {
        let options = [];
        for (let i = 0; i < this.gameState.board.length; i++) {
            for (let j = 0; j < this.gameState.board.length; j++) {
                if (this.gameState.board[i][j] === 0) {
                    options.push({
                        x: i,
                        y: j
                    });
                }
            }
        }

        if (options.length > 0) {
            let spot = options[Math.floor(Math.random() * options.length)];
            let chance = Math.random(1);
            this.gameState.board[spot.x][spot.y] = chance > 0.1 ? 2 : 4;
        }
    }

    makeBlank() {
        let blank = [];
        for (var i = 0; i < this.size; i++) {
            blank[i] = [];
            for (var j = 0; j < this.size; j++) {
                blank[i][j] = 0;
            }
        }
        return blank;
    }

    slide(row) {
        let array = row.filter(val => val);
        let missing = this.size - array.length;
        let empty = Array(missing).fill(0);
        array = empty.concat(array);
        return array;
    }

    combine(row) {
        for (let i = this.size - 1; i >= 1; i--) {
            let a = row[i];
            let b = row[i - 1];
            if (a == b) {
                row[i] = a + b;
                row[i - 1] = 0;
                this.gameState.score += (a + b);
                if (a + b == 2048) {
                    this.gameState.won = true;
                    if (this.winArray.length > 0) {
                        for (let i = 0; i < this.winArray.length; i++) {
                            this.winArray[i](this.getGameState());
                        }
                    }
                }
            }
        }
        return row;
    }

    slideRow(row) {
        row = this.slide(row);
        row = this.combine(row);
        row = this.slide(row);
        return row;
    }

    compare(a, b) {
        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
                if (a[i][j] != b[i][j]) {
                    return true;
                }
            }
        }
        return false;
    }

    flip() {
        for (let i = 0; i < this.size; i++) {
            this.gameState.board[i].reverse();
        }
    }

    rotate() {
        let rotatedGrid = this.makeBlank();
        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
                rotatedGrid[i][j] = this.gameState.board[j][i];
                }
            }
        return rotatedGrid;
    }
    
    setupNewGame() {
        this.gameState.board = this.makeBlank();
        this.placeNumber();
        this.placeNumber();
        this.gameState.score = 0;
        this.gameState.won = false;
        this.gameState.over = false;

    }

    loadGame(newGameState) {
        this.size = Math.sqrt(newGameState.board.length);
        let newBoard = this.makeBlank();
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                newBoard[i][j] = newGameState.board[i*this.size + j];
            }
        }

        this.gameState.board = newBoard;
        this.gameState.score = newGameState.score;
        this.gameState.won = newGameState.won;
        this.gameState.over = newGameState.over;


    }

    gameOver() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.gameState.board[i][j] == 0) {
                    return false;
                }

                if (i !== this.size -1 && this.gameState.board[i][j] === this.gameState.board[i+1][j]) {
                    return false;
                }

                if (j !== this.size -1 && this.gameState.board[i][j] === this.gameState.board[i][j + 1]) {
                    return false;
                }

            }
        }
        return true;
    }

    move(direction) {
        if (direction == "up") {
            this.gameState.board = this.rotate();
            this.flip();
            let prevBoard = [...this.gameState.board];
            for (let i = 0; i < this.size; i++) {
                this.gameState.board[i] = this.slideRow(this.gameState.board[i]);
            }
            let moved = this.compare(prevBoard, this.gameState.board);
            if (moved) {
                this.placeNumber();
            }
            this.flip();
            this.gameState.board = this.rotate();
            this.gameState.board = this.rotate();
            this.gameState.board = this.rotate();
            if (this.moveArray.length > 0) {
                for (let i = 0; i < this.moveArray.length; i++) {
                    this.moveArray[i](this.getGameState());
                }
            }
        }

        if (direction == "down") {
            this.gameState.board = this.rotate();
            let prevBoard = [...this.gameState.board];
            for (let i = 0; i < this.size; i++) {
                this.gameState.board[i] = this.slideRow(this.gameState.board[i]);
            }
            let moved = this.compare(prevBoard, this.gameState.board);
            if (moved) {
                this.placeNumber();
            }
            this.gameState.board = this.rotate();
            this.gameState.board = this.rotate();
            this.gameState.board = this.rotate();
            if (this.moveArray.length > 0) {
                for (let i = 0; i < this.moveArray.length; i++) {
                    this.moveArray[i](this.getGameState());
                }
            }
        }

        if (direction == "left") {
            this.flip();
            let prevBoard = [...this.gameState.board];
            for (let i = 0; i < this.size; i++) {
                this.gameState.board[i] = this.slideRow(this.gameState.board[i]);
            }
            let moved = this.compare(prevBoard, this.gameState.board);
            if (moved) {
                this.placeNumber();
            }
            this.flip();
            if (this.moveArray.length > 0) {
                for (let i = 0; i < this.moveArray.length; i++) {
                    this.moveArray[i](this.getGameState());
                }
            }
        }

        if (direction == "right") {
            let prevBoard = [...this.gameState.board];
            for (let i = 0; i < this.size; i++) {
                this.gameState.board[i] = this.slideRow(this.gameState.board[i]);
            }
            let moved = this.compare(prevBoard, this.gameState.board);
            if (moved) {
                this.placeNumber();
            }
            if (this.moveArray.length > 0) {
                for (let i = 0; i < this.moveArray.length; i++) {
                    this.moveArray[i](this.getGameState());
                }
            }
        }

        if (this.gameOver()) {
            this.gameState.over = true;
            if (this.loseArray.length > 0) {
                for (let i = 0; i < this.loseArray.length; i++) {
                    this.loseArray[i](this.getGameState());
                }
            }
        }

    }

    toString() {
        console.table(this.gameState.board);
    }

    onMove(callback) {
        this.moveArray.push(callback);
    }

    onWin(callback) {
        this.winArray.push(callback);
    }

    onLose(callback) {
        this.loseArray.push(callback);
    }

    getGameState() {
        let oneDimBoard = []
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                oneDimBoard[i*this.size + j] = this.gameState.board[i][j];
            }
        }
        return {
            board: oneDimBoard,
            score: this.gameState.score,
            won: this.gameState.won,
            over: this.gameState.over

        }

    }


 }
