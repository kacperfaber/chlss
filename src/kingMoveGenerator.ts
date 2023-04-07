import {BoardPosition} from "./boardPosition";
import {Piece} from "./piece";
import {Colour} from "./colour";
import {IMove} from "./move";
import {Coords} from "./coords";
import {SquareIndex} from "./square";

type KingMoveOffset = {x: number, y: number};

interface IKingMoveGenerator {
    offsets: Array<KingMoveOffset>;
    addMoveAsync(boardPosition: BoardPosition, index: SquareIndex, piece: Piece, colour: Colour, posX: number, posY: number, moveList: Array<IMove>, offsetX: number, offsetY: number): Promise<void>
    generateKingMoves(boardPosition: BoardPosition, index: SquareIndex, piece: Piece, colour: Colour, posX: number, posY: number, moveList: Array<IMove>): Promise<void>
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

    async addMoveAsync(boardPosition: BoardPosition, index: SquareIndex, piece: Piece, colour: Colour, posX: number, posY: number, moveList: Array<IMove>, offsetX: number, offsetY: number): Promise<void> {
        const tX = posX + offsetX;
        const tY = posY + offsetY;

        if (!(await BoardPosition.isInBoard(tX, tY))) return;

        const targetIndex = Coords.toSquareIndex(tX, tY);

        const tPiece = await BoardPosition.getPieceOrNull(boardPosition, targetIndex);

        if (tPiece==null) return;

        if (await Piece.isEnemyOrEmpty(tPiece, colour)) {
            moveList.push(
                {
                    from: index,
                    to: targetIndex,
                    piece: piece,
                    targetPiece: tPiece
                }
            )
        }
    },

    async generateKingMoves(boardPosition: BoardPosition, index: SquareIndex,  piece: Piece, colour: Colour, posX: number, posY: number, moveList: Array<IMove>): Promise<void> {
        await Promise.all(this.offsets.map(({x, y}) => {
            return this.addMoveAsync(boardPosition, index, piece, colour, posX, posY, moveList, x, y);
        }));
    }
}