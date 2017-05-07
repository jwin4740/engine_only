var onDragStart = function (source, piece, position, orientation) {
    if (game.in_checkmate() === true || game.in_draw() === true ||
        piece.search(/^b/) !== -1) {
        return false;
    }
};

var onDrop = function (source, target) {
    // see if the move is legal
    color = 'white';
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q',
    });

    if (move === null) return 'snapback';
    // getGameScore(move, color);
    setTimeout(makeEngineMove, 1500);
};


var onSnapEnd = function () {
    board.position(game.fen());
};

function makeEngineMove() {
    color = 'black';

    var bestMove = getEngineMove(game);
    game.ugly_move(bestMove);
    // game.ugly_move({
    //     color: "b",
    //     flags: 1,
    //     from: 21,
    //     piece: "p",
    //     to: 53
    // });
    tempScoreArray = [];
    board.position(game.fen());



}


var cfg = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    orientation: 'white',
    onSnapEnd: onSnapEnd
};
board = ChessBoard('board', cfg);