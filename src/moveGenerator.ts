import {IMove} from "./move";
import {Board, IBoard} from "./board";
import {Colour, Colours} from "./colour";
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
    generatePseudoLegalMoves(boardPosition: BoardPosition, colourToMove: Colour, moveList: Array<IMove>, enPassant: SquareIndex | null): Promise<void>;
    generateLegalMoves(board: IBoard, colourToMove: Colour): Promise<Array<IMove>>;
    filterIllegalMoves(moveList: Array<IMove>, colourToMove: Colour, boardPosition: BoardPosition, enPassant: SquareIndex | null): Promise<void>;
}

export const MoveGenerator: IMoveGenerator = {
    async filterIllegalMoves(moveList: Array<IMove>, colourToMove: Colour, boardPosition: BoardPosition, enPassant: SquareIndex | null): Promise<void> {
        for (const iMove of [...moveList].reverse()) {
            const position = await BoardPosition.copyAsync(boardPosition);
            await BoardPosition.makeMoveAsync(position, iMove);

            const enemyMoves: Array<IMove> = [];
            await MoveGenerator.generatePseudoLegalMoves(position, Colours.inverseColour(colourToMove), enemyMoves, enPassant);

            const ourKingPiece = Piece.getKing(colourToMove);

            const canKillKing = enemyMoves.some(function (m: IMove) {
                return m.targetPiece === ourKingPiece;
            });

            if (canKillKing) {
                moveList.splice(moveList.indexOf(iMove), 1);
            }
        }
    },

    async generateLegalMoves(board: IBoard, colourToMove: Colour) {
        const moveList: Array<IMove> = [];
        await this.generatePseudoLegalMoves(board.position, colourToMove, moveList, board.enPassant);

        await this.filterIllegalMoves(moveList, colourToMove, board.position, board.enPassant);

        await CastlingMoveGenerator.generateCastlingMoves(board, colourToMove, moveList);

        return moveList;
    },

    async generatePseudoLegalMoves(boardPosition: BoardPosition, colourToMove: Colour, moveList: Array<IMove>, enPassant: SquareIndex | null) {
        /*
        * When all data is reached, and we have to use some generator [KingMoveGenerator etc.] to generate moves
        * We're adding it to the 'taskList' which is list of Promises.
        *  */
        const taskList: Array<Promise<void>> = [];

        function execTask(act: () => Promise<void>) {
            taskList.push(act());
        }

        for (let index = 0; index < 64; index++) {
            const squareIndex = index as SquareIndex;
            const piece = await BoardPosition.getPieceOrNull(boardPosition, squareIndex);

            /* if piece is empty, go to next square */
            if (piece == null) continue;

            const pieceColour = await Piece.getColour(piece);

            if (pieceColour == null) continue;

            /* If piece is not colour to move, go to next square. */
            if (!(await Piece.compareColour(pieceColour, colourToMove))) continue;

            /* get the square coords, to avoid double calls of the same methods... */
            const posX = Coords.toX(squareIndex);
            const posY = Coords.toY(squareIndex);

            if (Piece.isPawn(piece)) {
                execTask(() => PawnMoveGenerator.generatePawnMoves(boardPosition, piece, squareIndex, posX, posY, pieceColour, moveList, enPassant));
            } else if (Piece.isQueen(piece)) {
                execTask(() => QueenMoveGenerator.generateQueenMoves(boardPosition, piece, pieceColour, squareIndex, posX, posY, moveList));
            } else if (Piece.isBishop(piece)) {
                execTask(() => BishopMoveGenerator.generateBishopMoves(boardPosition, piece, pieceColour, squareIndex, posX, posY, moveList));
            } else if (Piece.isRook(piece)) {
                execTask(() => RookMoveGenerator.generateRookMoves(boardPosition, piece, pieceColour, squareIndex, posX, posY, moveList));
            } else if (Piece.isKnight(piece)) {
                execTask(() => KnightMoveGenerator.generateKnightMoves(boardPosition, piece, pieceColour, squareIndex, posX, posY, moveList));
            } else if (Piece.isKing(piece)) {
                execTask(() => KingMoveGenerator.generateKingMoves(boardPosition, squareIndex, piece, pieceColour, posX, posY, moveList));
            }
        }

        await Promise.all(taskList);
    }
};