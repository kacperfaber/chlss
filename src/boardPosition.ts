import {Piece} from "./piece";
import Pieces from "./pieces";

export type BoardPosition = [
    Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece,
    Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece,
    Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece,
    Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece,
    Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece,
    Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece,
    Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece,
    Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece
];

export default {
    createEmpty(): BoardPosition {
        let boardArray = new Array<Piece>();
        for (let x = 0; x < 64; x++) {
            boardArray.push(Pieces.Empty);
        }
        return boardArray as BoardPosition;
    }
}