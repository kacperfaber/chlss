import {BoardPosition} from "./boardPosition";
import {Piece} from "./piece";
import {Colour} from "./colour";
import {SquareIndex} from "./square";
import {IMove} from "./move";
import {LineMoveGenerator} from "./lineMoveGenerator";

interface IQueenMoveGenerator {
    generateQueenMoves(boardPosition: BoardPosition, piece: Piece, colour: Colour, index: SquareIndex, posX: number, posY: number, moveList: Array<IMove>);
}

export const QueenMoveGenerator: IQueenMoveGenerator = {
    async generateQueenMoves(boardPosition: BoardPosition, piece: Piece, colour: Colour, index: SquareIndex, posX: number, posY: number, moveList: Array<IMove>) {
        await Promise.all([
            LineMoveGenerator.generateRookLikeMoves(boardPosition, piece, colour, index, posX, posY, moveList),
            LineMoveGenerator.generateBishopLikeMoves(boardPosition, piece, colour, index, posX, posY, moveList)
        ]);
    }
}