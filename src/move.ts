import {SquareIndex} from "./square";
import {Piece} from "./piece";

export interface IMove {
    from: SquareIndex;
    to: SquareIndex;
    piece: Piece;
    targetPiece: Piece;
}
