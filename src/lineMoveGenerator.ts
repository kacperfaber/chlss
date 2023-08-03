import {Piece} from "./piece";
import {SquareIndex} from "./square";
import {IMove} from "./move";
import {BoardPosition} from "./boardPosition";
import {Coords} from "./coords";
import {Colour} from "./colour";

interface ILineMoveGenerator {
    generateMoves(boardPosition: BoardPosition, piece: Piece, index: SquareIndex, posX: number, posY: number, offsetX: number, offsetY: number, colour: Colour, moveList: Array<IMove>): void;

    generateBishopLikeMoves(boardPosition: BoardPosition, piece: Piece, colour: Colour, index: SquareIndex, posX: number, posY: number, moveList: Array<IMove>): void;

    generateRookLikeMoves(boardPosition: BoardPosition, piece: Piece, colour: Colour, index: SquareIndex, posX: number, posY: number, moveList: Array<IMove>): void;

    generateUsingOffsets(boardPosition: BoardPosition, piece: Piece, colour: Colour, index: SquareIndex, posX: number, posY: number, offsets: Array<Offsets>, moveList: Array<IMove>): void;
}

const RookOffsets: Array<Offsets> = [
    {x: 1, y: 0},
    {x: -1, y: 0},
    {x: 0, y: 1},
    {x: 0, y: -1},
];

const BishopOffsets: Array<Offsets> = [
    {x: 1, y: 1},
    {x: -1, y: -1},
    {x: 1, y: -1},
    {x: -1, y: 1},
];

type Offsets = { x: number, y: number };

export const LineMoveGenerator: ILineMoveGenerator = {
    generateMoves(boardPosition: BoardPosition, piece: Piece, index: SquareIndex, posX: number, posY: number, offsetX: number, offsetY: number, colour: Colour, moveList: Array<IMove>) {
        while (true) {
            posX = posX + offsetX;
            posY = posY + offsetY;

            if (!BoardPosition.isInBoard(posX, posY)) {
                break;
            }

            let targetPiece = BoardPosition.getPieceByCoords(boardPosition, posX, posY);

            if (!(Piece.isEnemyOrEmpty(targetPiece, colour))) {
                break;
            }

            moveList.push(
                {
                    from: index,
                    to: Coords.toSquareIndex(posX, posY),
                    piece: piece,
                    targetPiece: targetPiece,
                    setEnPassant: null,
                    promotion: undefined,
                    isPromo: false
                }
            );

            if (!Piece.isEmpty(targetPiece)) break;
        }
    },

    generateUsingOffsets(boardPosition: BoardPosition, piece: Piece, colour: Colour, index: SquareIndex, posX: number, posY: number, offsets: Array<Offsets>, moveList: Array<IMove>) {
        offsets.map(function (offset: Offsets) {
            LineMoveGenerator.generateMoves(boardPosition, piece, index, posX, posY, offset.x, offset.y, colour, moveList)
        })
    },

    generateBishopLikeMoves(boardPosition: BoardPosition, piece: Piece, colour: Colour, index: SquareIndex, posX: number, posY: number, moveList: Array<IMove>) {
        this.generateUsingOffsets(boardPosition, piece, colour, index, posX, posY, BishopOffsets, moveList);
    },

    generateRookLikeMoves(boardPosition: BoardPosition, piece: Piece, colour: Colour, index: SquareIndex, posX: number, posY: number, moveList: Array<IMove>) {
        this.generateUsingOffsets(boardPosition, piece, colour, index, posX, posY, RookOffsets, moveList);
    }
}