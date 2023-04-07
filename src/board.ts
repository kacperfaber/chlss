import {BoardPosition} from "./boardPosition";
import {Colour} from "./colour";
import {Castling} from "./castling";

export interface IBoard {
    position: BoardPosition;
    toMove: Colour;
    castling: Castling;
    enPassant: string | null;
    fullMoveCounter: number;
    halfMoveNumber: number;
}