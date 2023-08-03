import {FEN} from "../../src/fen";
import {Board, IBoard} from "../../src/board";
import {Piece} from "../../src/piece";
import {BoardPosition} from "../../src/boardPosition";
import {Coords} from "../../src/coords";

export  function fromFEN(fen: string): IBoard {
    const board = Board.createEmpty();
     FEN.loadFEN(fen, board);
    return board;
}

export  function boardOf(...arr: Array<{x: number, y: number, piece: Piece}>) {
    const board =  BoardPosition.createEmpty();
    arr.forEach(function (e) {
         board[Coords.toSquareIndex(e.x, e.y)] = e.piece;
    });
    return board;
}