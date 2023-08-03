import {IMove} from "./move";
import {BoardPosition} from "./boardPosition";
import {Castling, CastlingColour} from "./castling";
import {Colour, Colours} from "./colour";
import {SquareIndex} from "./square";
import {MoveGenerator} from "./moveGenerator";
import {IBoard} from "./board";
import Pieces from "./pieces";

interface ICastlingMoveGenerator {
    generateCastlingMoves(board: IBoard, colour: Colour, moveList: Array<IMove>): void;

    getCastlingColourForColour(castling: Castling, colour: Colour): CastlingColour;

    tryAddQueenSideCastling(board: IBoard, colour: Colour, castlingColour: CastlingColour, moveList: Array<IMove>): void;

    tryAddKingSideCastling(board: IBoard, colour: Colour, castlingColour: CastlingColour, moveList: Array<IMove>): void
}

export const CastlingMoveGenerator: ICastlingMoveGenerator = {
    generateCastlingMoves(board: IBoard, colour: Colour, moveList: Array<IMove>): void {
        const castlingColour = this.getCastlingColourForColour(board.castling, colour);

        this.tryAddQueenSideCastling(board, colour, castlingColour, moveList);
        this.tryAddKingSideCastling(board, colour, castlingColour, moveList);
    },

    getCastlingColourForColour(castling: Castling, colour: Colour): CastlingColour {
        return colour == Colours.white ? castling.white : castling.black;
    },

    tryAddKingSideCastling(board: IBoard, colour: Colour, castlingColour: CastlingColour, moveList: Array<IMove>): void {

        if (!castlingColour.kingSide) return;

        if (colour == Colours.white) {
            if (!(BoardPosition.isSquaresEmpty(board.position, 62 as SquareIndex, 61 as SquareIndex))) return;

            const enemyMoves: Array<IMove> = [];
            MoveGenerator.generatePseudoLegalMoves(board.position, Colours.inverseColour(colour), enemyMoves, null);

            if (!(BoardPosition.isSquaresNotUnderAttack(Colours.inverseColour(colour), enemyMoves, board.position, 60 as SquareIndex, 62 as SquareIndex, 61 as SquareIndex)))
                return;

            moveList.push({
                from: 60 as SquareIndex,
                to: 63 as SquareIndex,
                piece: Pieces.WhiteKing,
                targetPiece: Pieces.WhiteRook,
                setEnPassant: null,
                promotion: undefined,
                isPromo: false
            });
        } else if (colour == Colours.black) {
            if (!(BoardPosition.isSquaresEmpty(board.position, 5 as SquareIndex, 6 as SquareIndex))) return;

            const enemyMoves: Array<IMove> = [];
            MoveGenerator.generatePseudoLegalMoves(board.position, Colours.inverseColour(colour), enemyMoves, null);

            if (!(BoardPosition.isSquaresNotUnderAttack(Colours.inverseColour(colour), enemyMoves, board.position, 5 as SquareIndex, 6 as SquareIndex, 4 as SquareIndex)))
                return;

            moveList.push({
                from: 4 as SquareIndex,
                to: 7 as SquareIndex,
                piece: Pieces.BlackKing,
                targetPiece: Pieces.BlackRook,
                setEnPassant: null,
                promotion: undefined,
                isPromo: false
            });
        }

    },

    tryAddQueenSideCastling(board: IBoard, colour: Colour, castlingColour: CastlingColour, moveList: Array<IMove>): void {
        if (!castlingColour.queenSide) return;

        if (colour == Colours.white) {
            if (!(BoardPosition.isSquaresEmpty(board.position, 59 as SquareIndex, 58 as SquareIndex, 57 as SquareIndex))) return;

            const enemyMoves: Array<IMove> = [];
            MoveGenerator.generatePseudoLegalMoves(board.position, Colours.inverseColour(colour), enemyMoves, null);

            if (!(BoardPosition.isSquaresNotUnderAttack(Colours.inverseColour(colour), enemyMoves, board.position, 59 as SquareIndex, 58 as SquareIndex, 60 as SquareIndex)))
                return;

            moveList.push({
                from: 60 as SquareIndex,
                to: 56 as SquareIndex,
                piece: Pieces.WhiteKing,
                targetPiece: Pieces.WhiteRook,
                setEnPassant: null,
                promotion: undefined,
                isPromo: false
            });
        } else if (colour == Colours.black) {
            if (!(BoardPosition.isSquaresEmpty(board.position, 2 as SquareIndex, 3 as SquareIndex))) return;

            const enemyMoves: Array<IMove> = [];
            MoveGenerator.generatePseudoLegalMoves(board.position, Colours.inverseColour(colour), enemyMoves, null);

            if (!(BoardPosition.isSquaresNotUnderAttack(Colours.inverseColour(colour), enemyMoves, board.position, 2 as SquareIndex, 3 as SquareIndex, 4 as SquareIndex)))
                return;

            moveList.push({
                from: 4 as SquareIndex,
                to: 0 as SquareIndex,
                piece: Pieces.BlackKing,
                targetPiece: Pieces.BlackRook,
                setEnPassant: null,
                promotion: undefined,
                isPromo: false
            });
        }
    }


};