import {IMove} from "./move";
import {IBoard} from "./board";
import {Colour} from "./colour";
import {Piece} from "./piece";
import {BoardPosition} from "./boardPosition";
import {SquareIndex} from "./square";
import {Coords} from "./coords";

interface IMoveGenerator {
    generatePseudoLegalMoves(board: IBoard, colourToMove: Colour, moveList: Array<IMove>);
}

export const MoveGenerator: IMoveGenerator = {
    async generatePseudoLegalMoves(board: IBoard, colourToMove: Colour, moveList: Array<IMove>) {
        for (let index = 0; index < 63; index++) {
            const squareIndex = index as SquareIndex;
            const piece = await BoardPosition.getPieceOrNull(board.position, squareIndex);

            /* if piece is empty, go to next square */
            if (piece == null) continue;

            const pieceColour = await Piece.getColour(piece);

            /* If piece is not colour to move, go to next square. */
            if (!Piece.compareColour(pieceColour, colourToMove)) continue;

            const posX = Coords.toX(squareIndex);
            const posY = Coords.toY(squareIndex);



            // TODO:
        }
    }
}