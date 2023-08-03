import {BoardPosition} from "./boardPosition";
import {Piece} from "./piece";
import {SquareIndex} from "./square";
import {IMove} from "./move";
import {LineMoveGenerator} from "./lineMoveGenerator";
import {Colour} from "./colour";

interface IRookMoveGenerator {
    generateRookMoves(boardPosition: BoardPosition, piece: Piece, colour: Colour, index: SquareIndex, posX: number, posY: number, moveList: Array<IMove>): void;
}

export const RookMoveGenerator: IRookMoveGenerator = {
    generateRookMoves(boardPosition: BoardPosition, piece: Piece, colour: Colour, index: SquareIndex, posX: number, posY: number, moveList: Array<IMove>) {
        LineMoveGenerator.generateRookLikeMoves(boardPosition, piece, colour, index, posX, posY, moveList);
    }
}