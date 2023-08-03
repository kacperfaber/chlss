import {BoardPosition} from "./boardPosition";
import {Piece} from "./piece";
import {Colour} from "./colour";
import {SquareIndex} from "./square";
import {IMove} from "./move";
import {LineMoveGenerator} from "./lineMoveGenerator";

interface IQueenMoveGenerator {
    generateQueenMoves(boardPosition: BoardPosition, piece: Piece, colour: Colour, index: SquareIndex, posX: number, posY: number, moveList: Array<IMove>): void;
}

export const QueenMoveGenerator: IQueenMoveGenerator = {
     generateQueenMoves(boardPosition: BoardPosition, piece: Piece, colour: Colour, index: SquareIndex, posX: number, posY: number, moveList: Array<IMove>): void {
         Promise.all([
            LineMoveGenerator.generateRookLikeMoves(boardPosition, piece, colour, index, posX, posY, moveList),
            LineMoveGenerator.generateBishopLikeMoves(boardPosition, piece, colour, index, posX, posY, moveList)
        ]);
    }
}