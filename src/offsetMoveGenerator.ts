import {BoardPosition} from "./boardPosition";
import {Piece} from "./piece";
import {Colour} from "./colour";
import {SquareIndex} from "./square";
import {IMove} from "./move";
import {Coords} from "./coords";

export type MoveOffset = {x: number, y: number};

export const OffsetMoveGenerator = {
    async generateOffsets(boardPosition: BoardPosition, piece: Piece, colour: Colour, index: SquareIndex, posX: number, posY: number, offsets: Array<MoveOffset>, moveList: Array<IMove>): Promise<void> {
        for (let {x, y} of offsets) {
            await this.addMove(boardPosition, piece, colour, index, posX, posY, x, y, moveList);
        }
    },

    async addMove(boardPosition: BoardPosition, piece: Piece, colour: Colour, index: SquareIndex, posX: number, posY: number, offX: number, offY: number, moveList: Array<IMove>): Promise<void> {

        const tX = posX + offX;
        const tY = posY + offY;

        function pushMove(targetPiece: Piece) {
            moveList.push({
                from: index,
                to: Coords.toSquareIndex(tX, tY),
                piece: piece,
                targetPiece: targetPiece,
                setEnPassant: null
            });
        }

        if (!await BoardPosition.isInBoard(tX, tY)) return;

        const tI = Coords.toSquareIndex(tX, tY);

        const tPiece = await BoardPosition.getPiece(boardPosition, tI);

        const tColour = await Piece.getColour(tPiece);

        if (await Piece.isColourEnemyOrNull(tColour, colour)){
            pushMove(tPiece);
        }
    }
}
