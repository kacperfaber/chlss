import {BoardPosition} from "./boardPosition";
import {IMove} from "./move";
import {SquareIndex} from "./square";
import {Piece} from "./piece";
import {Colour} from "./colour";
import {Coords} from "./coords";

type KnightOffset = { x: number, y: number };

interface IKnightMoveGenerator {
    offsets: Array<KnightOffset>;

    addMoveAsync(boardPosition: BoardPosition, piece: Piece, colour: Colour, index: SquareIndex, posX: number, posY: number, moveList: Array<IMove>, offX: number, offY: number): Promise<void>;

    generateKnightMoves(boardPosition: BoardPosition, piece: Piece, colour: Colour, index: SquareIndex, posX: number, posY: number, moveList: Array<IMove>): Promise<void>;
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

    async generateKnightMoves(boardPosition: BoardPosition, piece: Piece, colour: Colour, index: SquareIndex, posX: number, posY: number, moveList: Array<IMove>): Promise<void> {

        await Promise.all(
            this.offsets.map((
                ({x, y}) => this.addMoveAsync(boardPosition, piece, colour, index, posX, posY, moveList, x, y))
            )
        );

    },

    async addMoveAsync(boardPosition: BoardPosition, piece: Piece, colour: Colour, index: SquareIndex, posX: number, posY: number, moveList: Array<IMove>, offX: number, offY: number): Promise<void> {
        const tX = posX + offX;
        const tY = posY + offY;

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
            );
        }
    }
};