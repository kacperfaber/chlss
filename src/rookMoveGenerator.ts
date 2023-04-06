import {BoardPosition} from "./boardPosition";
import {Piece} from "./piece";
import {SquareIndex} from "./square";
import {IMove} from "./move";
import {LineMoveGenerator} from "./lineMoveGenerator";
import {Colour} from "./colour";

interface IRookMoveGenerator {
    generateRookMoves(boardPosition: BoardPosition, piece: Piece, colour: Colour, index: SquareIndex, posX: number, posY: number, moveList: Array<IMove>);
}

export const RookMoveGenerator: IRookMoveGenerator = {
    async generateRookMoves(boardPosition: BoardPosition, piece: Piece, colour: Colour, index: SquareIndex, posX: number, posY: number, moveList: Array<IMove>) {
        await LineMoveGenerator.generateRookLikeMoves(boardPosition, piece, colour, index, posX, posY, moveList);
    }
}