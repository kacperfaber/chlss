import {BoardPosition} from "./boardPosition";
import {Piece} from "./piece";
import {Colour} from "./colour";
import {SquareIndex} from "./square";
import {IMove} from "./move";
import {Coords} from "./coords";

export type MoveOffset = {x: number, y: number};

export const OffsetMoveGenerator = {
     generateOffsets(boardPosition: BoardPosition, piece: Piece, colour: Colour, index: SquareIndex, posX: number, posY: number, offsets: Array<MoveOffset>, moveList: Array<IMove>): void {
        for (let {x, y} of offsets) {
             this.addMove(boardPosition, piece, colour, index, posX, posY, x, y, moveList);
        }
    },

     addMove(boardPosition: BoardPosition, piece: Piece, colour: Colour, index: SquareIndex, posX: number, posY: number, offX: number, offY: number, moveList: Array<IMove>): void {

        const tX = posX + offX;
        const tY = posY + offY;

        function pushMove(targetPiece: Piece) {
            moveList.push({
                from: index,
                to: Coords.toSquareIndex(tX, tY),
                piece: piece,
                targetPiece: targetPiece,
                setEnPassant: null,
                promotion: undefined,
                isPromo: false
            });
        }

        if (! BoardPosition.isInBoard(tX, tY)) return;

        const tI = Coords.toSquareIndex(tX, tY);

        const tPiece =  BoardPosition.getPiece(boardPosition, tI);

        const tColour =  Piece.getColour(tPiece);

        if ( Piece.isColourEnemyOrNull(tColour, colour)){
            pushMove(tPiece);
        }
    }
}
