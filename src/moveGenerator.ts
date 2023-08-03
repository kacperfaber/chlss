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
import {MoveMaker} from "./moveMaker";

interface IMoveGenerator {
    generatePseudoLegalMoves(boardPosition: BoardPosition, colourToMove: Colour, moveList: Array<IMove>, enPassant: SquareIndex | null): void;
    generateLegalMoves(board: IBoard, colourToMove: Colour): Array<IMove>;
    filterIllegalMoves(moveList: Array<IMove>, colourToMove: Colour, boardPosition: BoardPosition, enPassant: SquareIndex | null): void;
}

export const MoveGenerator: IMoveGenerator = {
     filterIllegalMoves(moveList: Array<IMove>, colourToMove: Colour, boardPosition: BoardPosition, enPassant: SquareIndex | null): void {
        for (const iMove of [...moveList].reverse()) {
            const position =  BoardPosition.copyAsync(boardPosition);
             MoveMaker.makeMoveOnBoard(position, iMove);

            const enemyMoves: Array<IMove> = [];
             MoveGenerator.generatePseudoLegalMoves(position, Colours.inverseColour(colourToMove), enemyMoves, enPassant);

            const ourKingPiece = Piece.getKing(colourToMove);

            const canKillKing = enemyMoves.some(function (m: IMove) {
                return m.targetPiece === ourKingPiece;
            });

            if (canKillKing) {
                moveList.splice(moveList.indexOf(iMove), 1);
            }
        }
    },

     generateLegalMoves(board: IBoard, colourToMove: Colour) {
        const moveList: Array<IMove> = [];
         this.generatePseudoLegalMoves(board.position, colourToMove, moveList, board.enPassant);

         this.filterIllegalMoves(moveList, colourToMove, board.position, board.enPassant);

         CastlingMoveGenerator.generateCastlingMoves(board, colourToMove, moveList);

        return moveList;
    },

     generatePseudoLegalMoves(boardPosition: BoardPosition, colourToMove: Colour, moveList: Array<IMove>, enPassant: SquareIndex | null) {
        /*
        * When all data is reached, and we have to use some generator [KingMoveGenerator etc.] to generate moves
        * We're adding it to the 'taskList' which is list of Promises.
        *  */
        const taskList: Array<void> = [];

        function execTask(act: () => void) {
            taskList.push(act());
        }

        for (let index = 0; index < 64; index++) {
            const squareIndex = index as SquareIndex;
            const piece =  BoardPosition.getPieceOrNull(boardPosition, squareIndex);

            /* if piece is empty, go to next square */
            if (piece == null) continue;

            const pieceColour =  Piece.getColour(piece);

            if (pieceColour == null) continue;

            /* If piece is not colour to move, go to next square. */
            if (!( Piece.compareColour(pieceColour, colourToMove))) continue;

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

         Promise.all(taskList);
    }
};