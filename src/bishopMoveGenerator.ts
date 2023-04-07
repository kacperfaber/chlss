import {BoardPosition} from "./boardPosition";
import {Piece} from "./piece";
import {SquareIndex} from "./square";
import {Colour} from "./colour";
import {IMove} from "./move";
import {LineMoveGenerator} from "./lineMoveGenerator";

interface IBishopMoveGenerator {
    generateBishopMoves(boardPosition: BoardPosition, piece: Piece, colour: Colour, index: SquareIndex, posX: number, posY: number, moveList: Array<IMove>): Promise<void>;
}

export const BishopMoveGenerator: IBishopMoveGenerator = {
    async generateBishopMoves(boardPosition: BoardPosition, piece: Piece, colour: Colour, index: SquareIndex, posX: number, posY: number, moveList: Array<IMove>) {
        await LineMoveGenerator.generateBishopLikeMoves(boardPosition, piece, colour, index, posX, posY, moveList);
    }
}