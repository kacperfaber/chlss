import {Piece} from "./piece";
import {SquareIndex} from "./square";
import {IMove} from "./move";
import {BoardPosition} from "./boardPosition";
import {Coords} from "./coords";
import {Colour} from "./colour";

interface ILineMoveGenerator {
    generateMoves(boardPosition: BoardPosition, piece: Piece, index: SquareIndex, posX: number, posY: number, offsetX: number, offsetY: number, colour: Colour, moveList: Array<IMove>): Promise<void>;

    generateBishopLikeMoves(boardPosition: BoardPosition, piece: Piece, colour: Colour, index: SquareIndex, posX: number, posY: number, moveList: Array<IMove>): Promise<void>;

    generateRookLikeMoves(boardPosition: BoardPosition, piece: Piece, colour: Colour, index: SquareIndex, posX: number, posY: number, moveList: Array<IMove>): Promise<void>;

    generateUsingOffsets(boardPosition: BoardPosition, piece: Piece, colour: Colour, index: SquareIndex, posX: number, posY: number, offsets: Array<Offsets>, moveList: Array<IMove>): Promise<void>;
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
    async generateMoves(boardPosition: BoardPosition, piece: Piece, index: SquareIndex, posX: number, posY: number, offsetX: number, offsetY: number, colour: Colour, moveList: Array<IMove>) {
        while (true) {
            posX = posX + offsetX;
            posY = posY + offsetY;

            if (!await BoardPosition.isInBoard(posX, posY)) {
                break;
            }

            let targetPiece = await BoardPosition.getPieceByCoords(boardPosition, posX, posY);

            if (!(await Piece.isEnemyOrEmpty(targetPiece, colour))) {
                break;
            }

            moveList.push(
                {
                    from: index,
                    to: Coords.toSquareIndex(posX, posY),
                    piece: piece,
                    targetPiece: targetPiece,
                    setEnPassant: null,
                    promotion: undefined
                }
            );

            if (!await Piece.isEmpty(targetPiece)) break;
        }
    },

    async generateUsingOffsets(boardPosition: BoardPosition, piece: Piece, colour: Colour, index: SquareIndex, posX: number, posY: number, offsets: Array<Offsets>, moveList: Array<IMove>) {
        await Promise.all(offsets.map(async function (offset: Offsets) {
            await LineMoveGenerator.generateMoves(boardPosition, piece, index, posX, posY, offset.x, offset.y, colour, moveList)
        }));
    },

    async generateBishopLikeMoves(boardPosition: BoardPosition, piece: Piece, colour: Colour, index: SquareIndex, posX: number, posY: number, moveList: Array<IMove>) {
        await this.generateUsingOffsets(boardPosition, piece, colour, index, posX, posY, BishopOffsets, moveList);
    },

    async generateRookLikeMoves(boardPosition: BoardPosition, piece: Piece, colour: Colour, index: SquareIndex, posX: number, posY: number, moveList: Array<IMove>) {
        await this.generateUsingOffsets(boardPosition, piece, colour, index, posX, posY, RookOffsets, moveList);
    }
}