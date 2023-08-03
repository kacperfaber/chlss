import {BoardPosition} from "./boardPosition";
import {IMove} from "./move";
import {SquareIndex} from "./square";
import {Piece} from "./piece";
import {Colour} from "./colour";
import {MoveOffset, OffsetMoveGenerator} from "./offsetMoveGenerator";

interface IKnightMoveGenerator {
    offsets: Array<MoveOffset>;
    generateKnightMoves(boardPosition: BoardPosition, piece: Piece, colour: Colour, index: SquareIndex, posX: number, posY: number, moveList: Array<IMove>): void;
}

export const KnightMoveGenerator: IKnightMoveGenerator = {
    offsets: [
        {x: -1, y: 2},
        {x: 1, y: 2},
        {x: -1, y: -2},
        {x: 1, y: -2},
        {x: -2, y: -1},
        {x: -2, y: 1},
        {x: 2, y: -1},
        {x: 2, y: 1},
    ],

     generateKnightMoves(boardPosition: BoardPosition, piece: Piece, colour: Colour, index: SquareIndex, posX: number, posY: number, moveList: Array<IMove>): void {
         OffsetMoveGenerator.generateOffsets(boardPosition, piece, colour, index, posX, posY, this.offsets, moveList);
    }
};