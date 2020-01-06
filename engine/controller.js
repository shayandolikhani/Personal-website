import Game from "./game.js";

let game = new Game(4);
$(".reset").on("click", reset);

function loadGame() {
    $(".subtitle").replaceWith(`<p class = "subtitle has-text-weight-light">Score: ${game.getGameState().score}</p>`);
    for (var i = 0; i < game.getGameState().board.length; i++) {
        if (game.getGameState().board[i] == 0) {
            $(`.${i+1}`).replaceWith(`<p class = "title has-text-light has-text-centered ${i+1}"><br></p>`);
        } else {
            $(`.${i+1}`).replaceWith(`<p class = "title has-text-light has-text-centered ${i+1}">${game.getGameState().board[i]}</p>`);
        }
    }

}

loadGame();

game.onMove(loadGame);
game.onWin(function(){
    $(".notify").replaceWith(`<p class = "notify title has-text-weight-bold">You won!</p>`);
});
game.onLose(function (){
    $(".notify").replaceWith(`<p class = "notify title has-text-weight-bold">You lost! Press reset to start over.</p>`);
})


$(document).keydown(function(event) {
    var key = event.keyCode;
    if (key == '37') {
        game.move("left");
    }

    if (key == '38') {
        game.move("up");
    }

    if (key == '39') {
        game.move("right");
    }

    if (key == '40') {
        game.move("down");
    } 
}
);

function reset() {
    $(".notify").replaceWith(`<p class = "notify title has-text-weight-bold"></p>`);
    game.setupNewGame();
    loadGame();
}