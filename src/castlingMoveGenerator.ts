import {IMove} from "./move";
import {BoardPosition} from "./boardPosition";
import {Castling, CastlingColour} from "./castling";
import {Colour, Colours} from "./colour";
import {SquareIndex} from "./square";
import {MoveGenerator} from "./moveGenerator";
import {IBoard} from "./board";
import Pieces from "./pieces";

interface ICastlingMoveGenerator {
    generateCastlingMoves(board: IBoard, colour: Colour, moveList: Array<IMove>): Promise<void>;

    getCastlingColourForColour(castling: Castling, colour: Colour): Promise<CastlingColour>;

    tryAddQueenSideCastling(board: IBoard, colour: Colour, castlingColour: CastlingColour, moveList: Array<IMove>): Promise<void>;

    tryAddKingSideCastling(board: IBoard, colour: Colour, castlingColour: CastlingColour, moveList: Array<IMove>): Promise<void>
}

export const CastlingMoveGenerator: ICastlingMoveGenerator = {
    async generateCastlingMoves(board: IBoard, colour: Colour, moveList: Array<IMove>): Promise<void> {
        const castlingColour = await this.getCastlingColourForColour(board.castling, colour);

        await Promise.all([
            this.tryAddQueenSideCastling(board, colour, castlingColour, moveList),
            this.tryAddKingSideCastling(board, colour, castlingColour, moveList),
        ]);
    },

    async getCastlingColourForColour(castling: Castling, colour: Colour): Promise<CastlingColour> {
        return colour == Colours.white ? castling.white : castling.black;
    },

    async tryAddKingSideCastling(board: IBoard, colour: Colour, castlingColour: CastlingColour, moveList: Array<IMove>): Promise<void> {

        if (!castlingColour.kingSide) return;

        if (colour == Colours.white) {
            if (!(await BoardPosition.isSquaresEmpty(board.position, 62 as SquareIndex, 61 as SquareIndex))) return;

            const enemyMoves: Array<IMove> = [];
            await MoveGenerator.generatePseudoLegalMoves(board.position, Colours.inverseColour(colour), enemyMoves);

            if (!(await BoardPosition.isSquaresNotUnderAttack(enemyMoves, 60 as SquareIndex, 62 as SquareIndex, 61 as SquareIndex)))
                return;

            moveList.push({
                from: 60 as SquareIndex,
                to: 63 as SquareIndex,
                piece: Pieces.WhiteKing,
                targetPiece: Pieces.WhiteRook
            });
        }

        else if (colour == Colours.black) {
            if (!(await BoardPosition.isSquaresEmpty(board.position, 5 as SquareIndex, 6 as SquareIndex))) return;

            const enemyMoves: Array<IMove> = [];
            await MoveGenerator.generatePseudoLegalMoves(board.position, Colours.inverseColour(colour), enemyMoves);

            if (!(await BoardPosition.isSquaresNotUnderAttack(enemyMoves, 5 as SquareIndex, 6 as SquareIndex, 4 as SquareIndex)))
                return;

            moveList.push({
                from: 4 as SquareIndex,
                to: 7 as SquareIndex,
                piece: Pieces.BlackKing,
                targetPiece: Pieces.BlackRook
            });
        }

    },

    async tryAddQueenSideCastling(board: IBoard, colour: Colour, castlingColour: CastlingColour, moveList: Array<IMove>): Promise<void> {
        if (!castlingColour.queenSide) return;

        if (colour == Colours.white) {
            if (!(await BoardPosition.isSquaresEmpty(board.position, 59 as SquareIndex, 58 as SquareIndex, 57 as SquareIndex))) return;

            const enemyMoves: Array<IMove> = [];
            await MoveGenerator.generatePseudoLegalMoves(board.position, Colours.inverseColour(colour), enemyMoves);

            if (!(await BoardPosition.isSquaresNotUnderAttack(enemyMoves, 59 as SquareIndex, 58 as SquareIndex, 57 as SquareIndex, 60 as SquareIndex)))
                return;

            moveList.push({
                from: 60 as SquareIndex,
                to: 56 as SquareIndex,
                piece: Pieces.WhiteKing,
                targetPiece: Pieces.WhiteRook
            });
        }

        else if (colour == Colours.black) {
            if (!(await BoardPosition.isSquaresEmpty(board.position, 1 as SquareIndex, 2 as SquareIndex, 3 as SquareIndex))) return;

            const enemyMoves: Array<IMove> = [];
            await MoveGenerator.generatePseudoLegalMoves(board.position, Colours.inverseColour(colour), enemyMoves);

            if (!(await BoardPosition.isSquaresNotUnderAttack(enemyMoves, 1 as SquareIndex, 2 as SquareIndex, 3 as SquareIndex, 4 as SquareIndex)))
                return;

            moveList.push({
                from: 4 as SquareIndex,
                to: 0 as SquareIndex,
                piece: Pieces.BlackKing,
                targetPiece: Pieces.BlackRook
            });
        }
    }


};