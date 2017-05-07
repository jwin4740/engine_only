var engineSource;
var engineTarget;
var roundedScore;
var game = new Chess();
var move;
var board;

const pieceObject = {
    empty: 0,
    wP: {
        index: 1,
        value: 100
    },
    wN: {
        index: 2,
        value: 300
    },
    wB: {
        index: 3,
        value: 300
    },
    wR: {
        index: 4,
        value: 500
    },
    wQ: {
        index: 5,
        value: 900
    },
    wK: {
        index: 6,
        value: 1
    },
    bP: {
        index: 7,
        value: 100
    },
    bN: {
        index: 8,
        value: 300
    },
    bB: {
        index: 9,
        value: 300
    },
    bR: {
        index: 10,
        value: 500
    },
    bQ: {
        index: 11,
        value: 900
    },
    bK: {
        index: 12,
        value: 1
    }
};
var tempScoreArray = [];
var tempMaterialArray = [];
var GameScore = {};
var positionCount = 0;
GameScore.blackMaterial = 0;
GameScore.whiteMaterial = 0;
GameScore.startingScore = 0;
GameScore.currentScore = 0;
GameScore.searchScore = 0;
GameScore.captureScore = 0;
GameScore.mvvLvaScores = []; // every combination of victim and attacker will have their individual index


function getMaterialScores(game) {
    tempMaterialArray = [];
    GameScore.blackMaterial = 0;
    GameScore.whiteMaterial = 0;
    for (var i = 1; i < 9; i++) {
        for (var m = 97; m < 105; m++) {
            var kar = String.fromCharCode(m);
            var square = kar + i;
            var piece = game.get(square);
            tempMaterialArray.push(piece);
        }
    }
    // console.log(tempMaterialArray);
    var n = tempMaterialArray.length;
    for (var i = 0; i < n; i++) {
        if (tempMaterialArray[i] != null) {
            var pieceCode = tempMaterialArray[i].color + (tempMaterialArray[i].type).toUpperCase();
            if (pieceCode.includes('w')) {
                GameScore.whiteMaterial += pieceObject[pieceCode].value;

            } else {
                GameScore.blackMaterial += pieceObject[pieceCode].value;

            }
        }

    }
 
        GameScore.searchScore = (GameScore.blackMaterial - GameScore.whiteMaterial) / 100;
        return GameScore.searchScore;
}


var minimaxRoot = function (depth, game, isMaximisingPlayer) {

    var newGameMoves = game.ugly_moves();
    var bestMove = -9999;
    var bestMoveFound;

    for (var i = 0; i < newGameMoves.length; i++) {
        var newGameMove = newGameMoves[i]
        game.ugly_move(newGameMove);
        var value = minimax(depth - 1, game, -10000, 10000, !isMaximisingPlayer);
        game.undo();
        if (value >= bestMove) {
            bestMove = value;
            bestMoveFound = newGameMove;
        }
    }
    return bestMoveFound;
};

var minimax = function (depth, game, alpha, beta, isMaximisingPlayer) {
    positionCount++;
    if (depth === 0) {

        var myScore = getMaterialScores(game);
        tempScoreArray.push(myScore);
        return myScore
    }

    var newGameMoves = game.ugly_moves();

    if (isMaximisingPlayer) {
        var bestMove = -9999;
        for (var i = 0; i < newGameMoves.length; i++) {
            game.ugly_move(newGameMoves[i]);
            bestMove = Math.max(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer));
            game.undo();
            alpha = Math.max(alpha, bestMove);
            if (beta <= alpha) {
                return bestMove;
            }
        }
        return bestMove;
    } else {
        var bestMove = 9999;
        for (var i = 0; i < newGameMoves.length; i++) {
            game.ugly_move(newGameMoves[i]);
            bestMove = Math.min(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer));
            game.undo();
            beta = Math.min(beta, bestMove);
            if (beta <= alpha) {
                return bestMove;
            }
        }
        return bestMove;
    }
};


function getEngineMove() {

    if (game.game_over()) {
        alert('Game over');
    }
    searchMode = true;
  
    positionCount = 0;
    GameScore.searchScore = GameScore.currentScore;
    var bestMove = minimaxRoot(3, game, true);
      console.log(positionCount);

    // var captureArray = [];
    // var tempMoves = game.moves();

    // var legalMoves = game.moves({
    //     verbose: true
    // });
    // var n = legalMoves.length;
    // for (var i = 0; i < n; i++) {
    //     // TODO: add heuristics (mvv-lva, ...)
    //     if (legalMoves[i].flags.includes("c")) {
    //         captureArray.push(legalMoves[i]);
    //     }
    //     // TODO: function*(move) -> generate fen, calculate value of board
    // }
    // if (captureArray.length != 0) {
    //     var randomIndex = Math.floor(Math.random() * captureArray.length);
    //     var engineMove = captureArray[randomIndex];
    //     engineSource = engineMove.from;
    //     engineTarget = engineMove.to;
    // } else {
    // var randomIndex = Math.floor(Math.random() * tempMoves.length);
    // var engineMove = tempMoves[randomIndex];
    // engineSource = engineMove.from;
    // engineTarget = engineMove.to;
    // }
    searchMode = false;
    return bestMove;





}






/* capture only engine -----------------------------------------

function getEngineMove() {
    // minimaxRoot(2, game, true);
    var captureArray = [];
    var legalMoves = game.moves({
        verbose: true
    });
    var n = legalMoves.length;
    for (var i = 0; i < n; i++) {
        // TODO: add heuristics (mvv-lva, ...)
        if (legalMoves[i].flags.includes("c")) {
            captureArray.push(legalMoves[i]);
        }
        // TODO: function*(move) -> generate fen, calculate value of board
    }
    if (captureArray.length != 0) {
        var randomIndex = Math.floor(Math.random() * captureArray.length);
        var engineMove = captureArray[randomIndex];
        engineSource = engineMove.from;
        engineTarget = engineMove.to;
    } else {
        var randomIndex = Math.floor(Math.random() * legalMoves.length);
        var engineMove = legalMoves[randomIndex];
        engineSource = engineMove.from;
        engineTarget = engineMove.to;
    }
    return;

}

*/






















// most valuable victim and least valuable attacker
// so any moves that capture a queen searched first, then rook ...
// those moves themselves are searched against the least valuable attacker i.e. pawn capture queen
// pawn is 100   knight 200   bishop 300   rook 400   queen 500   king 600
const mvvLvaValue = [0, 100, 300, 300, 500, 500, 600, 100, 200, 300, 400, 500, 600];


// function InitMvvLva() {
//     var Attacker;
//     var Victim;
//     for (Attacker = PIECES.wP; Attacker <= PIECES.bK; ++Attacker) {
//         for (Victim = PIECES.wP; Victim <= PIECES.bK; ++Victim) {
//             MvvLvaScores[Victim * 14 + Attacker] = MvvLvaValue[Victim] + 6 - (MvvLvaValue[Attacker] / 100);
//             // example: pawn captures queen       506 - 100/100 = 505
//         }
//     }

// }

// employ mvv-lva heuristic