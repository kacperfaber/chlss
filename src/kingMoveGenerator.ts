import {BoardPosition} from "./boardPosition";
import {Piece} from "./piece";
import {Colour} from "./colour";
import {IMove} from "./move";
import {SquareIndex} from "./square";
import {MoveOffset, OffsetMoveGenerator} from "./offsetMoveGenerator";

interface IKingMoveGenerator {
    offsets: Array<MoveOffset>;
    generateKingMoves(boardPosition: BoardPosition, index: SquareIndex, piece: Piece, colour: Colour, posX: number, posY: number, moveList: Array<IMove>): void
}

export const KingMoveGenerator: IKingMoveGenerator = {
    offsets: [
        {x: 1, y: 0},
        {x: -1, y: 0},
        {x: 0, y: 1},
        {x: 0, y: -1},
        {x: -1, y: -1},
        {x: -1, y: 1},
        {x: 1, y: 1},
        {x: 1, y: -1},
    ],

     generateKingMoves(boardPosition: BoardPosition, index: SquareIndex,  piece: Piece, colour: Colour, posX: number, posY: number, moveList: Array<IMove>): void {
         OffsetMoveGenerator.generateOffsets(boardPosition, piece, colour, index, posX, posY, this.offsets, moveList);
    }
}