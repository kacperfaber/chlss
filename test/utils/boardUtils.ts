import {FEN} from "../../src/fen";
import {Board, IBoard} from "../../src/board";
import {Piece} from "../../src/piece";
import {BoardPosition} from "../../src/boardPosition";
import {Coords} from "../../src/coords";

export async function fromFEN(fen: string): Promise<IBoard> {
    const board = Board.createEmpty();
    await FEN.loadFEN(fen, board);
    return board;
}

export async function boardOf(...arr: Array<{x: number, y: number, piece: Piece}>) {
    const board = await BoardPosition.createEmpty();
    arr.forEach(function (e) {
         board[Coords.toSquareIndex(e.x, e.y)] = e.piece;
    });
    return board;
}