import {IMove} from "./move";
import {IBoard} from "./board";
import {Colour} from "./colour";
import {Piece} from "./piece";
import {BoardPosition} from "./boardPosition";
import {SquareIndex} from "./square";
import {Coords} from "./coords";
import {QueenMoveGenerator} from "./queenMoveGenerator";
import {PawnMoveGenerator} from "./pawnMoveGenerator";
import {BishopMoveGenerator} from "./bishopMoveGenerator";
import {RookMoveGenerator} from "./rookMoveGenerator";
import {KnightMoveGenerator} from "./knightMoveGenerator";
import {KingMoveGenerator} from "./kingMoveGenerator";
import {CastlingMoveGenerator} from "./castlingMoveGenerator";

interface IMoveGenerator {
    generatePseudoLegalMoves(board: IBoard, colourToMove: Colour, moveList: Array<IMove>): Promise<void>;
    generateLegalMoves(board: IBoard, colourToMove: Colour, moveList: Array<IMove>): Promise<void>;
}

export const MoveGenerator: IMoveGenerator = {
    async generateLegalMoves(board: IBoard, colourToMove: Colour) {
        const moveList: Array<IMove> = [];
        await this.generatePseudoLegalMoves(board, colourToMove, moveList);
        await CastlingMoveGenerator.generateCastlingMoves(board, colourToMove, moveList);
    },

    async generatePseudoLegalMoves(board: IBoard, colourToMove: Colour, moveList: Array<IMove>) {
        /*
        * When all data is reached, and we have to use some generator [KingMoveGenerator etc.] to generate moves
        * We're adding it to the 'taskList' which is list of Promises.
        *  */
        const taskList: Array<Promise<void>> = [];

        function execTask(act: () => Promise<void>) {
            taskList.push(act());
        }

        for (let index = 0; index < 63; index++) {
            const squareIndex = index as SquareIndex;
            const piece = await BoardPosition.getPieceOrNull(board.position, squareIndex);

            /* if piece is empty, go to next square */
            if (piece == null) continue;

            const pieceColour = await Piece.getColour(piece);

            /* If piece is not colour to move, go to next square. */
            if (!await Piece.compareColour(pieceColour, colourToMove)) continue;

            /* get the square coords, to avoid double calls of the same methods... */
            const posX = Coords.toX(squareIndex);
            const posY = Coords.toY(squareIndex);

            if (Piece.isPawn(piece)) {
                execTask(() => PawnMoveGenerator.generatePawnMoves(board.position, piece, squareIndex, posX, posY, pieceColour, moveList));
            } else if (Piece.isQueen(piece)) {
                execTask(() => QueenMoveGenerator.generateQueenMoves(board.position, piece, pieceColour, squareIndex, posX, posY, moveList));
            } else if (Piece.isBishop(piece)) {
                execTask(() => BishopMoveGenerator.generateBishopMoves(board.position, piece, pieceColour, squareIndex, posX, posY, moveList));
            } else if (Piece.isRook(piece)) {
                execTask(() => RookMoveGenerator.generateRookMoves(board.position, piece, pieceColour, squareIndex, posX, posY, moveList));
            } else if (Piece.isKnight(piece)) {
                execTask(() => KnightMoveGenerator.generateKnightMoves(board.position, piece, pieceColour, squareIndex, posX, posY, moveList));
            } else if (Piece.isKing(piece)) {
                execTask(() => KingMoveGenerator.generateKingMoves(board.position, squareIndex, piece, pieceColour, posX, posY, moveList));
            }
        }

        await Promise.all(taskList);
    }
};