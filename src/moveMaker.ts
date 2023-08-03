import {IMove} from "./move";
import {BoardPosition} from "./boardPosition";
import Pieces from "./pieces";
import {sq, SquareIndex} from "./square";
import {Piece} from "./piece";
import {Coords} from "./coords";
import {IBoard} from "./board";
import {Colour, Colours} from "./colour";
import {BoardNotation} from "./boardNotation";

export interface IMoveMaker {
    isCastlingMove(move: IMove): boolean;

    makePromotionMove(boardPosition: BoardPosition, move: IMove): void;

    makeCastle(boardPosition: BoardPosition, move: IMove): void;

    isEnPassant(move: IMove): { fromX: number, targetX: number } | null;

    makeNormalMove(board: IBoard, boardPosition: BoardPosition, move: IMove): void;

    makeMove(board: IBoard, move: IMove): void;

    makeEnPassant(boardPosition: BoardPosition, move: IMove, fromX: number, targetX: number): void;

    disableCastling(board: IBoard, move: IMove): void;

    clearEnPassant(board: IBoard): void;

    modifyFullMoveNumber(board: IBoard, move: IMove, colour: Colour): void;

    modifyHalfMoveNumber(board: IBoard, move: IMove, colour: Colour, isCastling: boolean, isEnPassant: boolean): void;

    isAttack(board: IBoard, move: IMove, colour: Colour, isCastling: boolean, isEnPassant: boolean): boolean;

    makeNormalMoveOnBoard(boardPosition: BoardPosition, move: IMove): void;

    trySetEnPassant(board: IBoard, move: IMove): void;

    tryDisableCastling(board: IBoard, move: IMove, isCastling: boolean): void;

    updateColourToMove(board: IBoard, move: IMove, colour: Colour): void;

    makeMoveOnBoard(boardPosition: BoardPosition, move: IMove): void;

    undoCastleMove(boardPosition: BoardPosition, move: IMove): void;

    undoEnPassantMove(boardPosition: BoardPosition, move: IMove): void;

    undoNormalMove(boardPosition: BoardPosition, move: IMove): void;

    undoMoveOnBoard(boardPosition: BoardPosition, move: IMove): void;
}

export const MoveMaker: IMoveMaker = {
    undoEnPassantMove(boardPosition: BoardPosition, move: IMove): void {
        const fromY = Coords.toY(move.from);
        const targetX = Coords.toX(move.to);
        const colour = Piece.getColour(move.piece);
        if (colour == null) throw new Error("Move.Piece can't be null.");

        function getEnemyPawnSquare(): SquareIndex {
            return Coords.toSquareIndex(targetX, fromY);
        }

        const pawnToAdd = Piece.getPawn(Colours.inverseColour(colour));

        BoardPosition.setPiece(boardPosition, getEnemyPawnSquare(), pawnToAdd);
        BoardPosition.setPiece(boardPosition, move.from, move.piece);
        BoardPosition.setEmpty(boardPosition, move.to);
    },

    undoNormalMove(boardPosition: BoardPosition, move: IMove): void {
        BoardPosition.setPiece(boardPosition, move.from, move.piece);
        BoardPosition.setPiece(boardPosition, move.to, move.targetPiece);
    },

    makeMoveOnBoard(boardPosition: BoardPosition, move: IMove): void {
        if (this.isCastlingMove(move)) {
            this.makeCastle(boardPosition, move);
            return;
        }

        const fromX = Coords.toX(move.from);
        const targetX = Coords.toX(move.to);

        if (this.isEnPassant(move)) {
            this.makeEnPassant(boardPosition, move, fromX, targetX);
            return;
        }

        this.makeNormalMoveOnBoard(boardPosition, move);
    },

    undoCastleMove(boardPosition: BoardPosition, move: IMove) {
        function setEmptyAll(...n: Array<number>) {
            n.forEach(t => BoardPosition.setEmpty(boardPosition, t as SquareIndex));
        }

        function place(n: number, piece: Piece) {
            BoardPosition.setPiece(boardPosition, n as SquareIndex, piece);
        }

        if (move.from == 60 as SquareIndex) {
            if (move.to == 63 as SquareIndex) {
                setEmptyAll(61, 62);
                place(60, Pieces.WhiteKing);
                place(63, Pieces.WhiteRook);
            } else if (move.to == 56 as SquareIndex) {
                setEmptyAll(58, 59);
                place(60, Pieces.WhiteKing);
                place(56, Pieces.WhiteRook);
            }
        } else if (move.from == 4 as SquareIndex) {
            if (move.to == 0 as SquareIndex) {
                setEmptyAll(5, 6);
                place(4, Pieces.BlackKing);
                place(7, Pieces.BlackRook);
            } else if (move.to == 7 as SquareIndex) {
                setEmptyAll(2, 3);
                place(4, Pieces.BlackKing);
                place(0, Pieces.BlackRook);
            }
        }
    },

    undoMoveOnBoard(boardPosition: BoardPosition, move: IMove): void {
        if (this.isCastlingMove(move)) {
            this.undoCastleMove(boardPosition, move);
            return;
        } else if (this.isEnPassant(move)) {
            this.undoEnPassantMove(boardPosition, move);
            return;
        }

        this.undoNormalMove(boardPosition, move);
    },

    updateColourToMove(board: IBoard, move: IMove, colour: Colour): void {
        board.toMove = Colours.inverseColour(colour);
    },


    isAttack(board: IBoard, move: IMove, colour: Colour, isCastling: boolean, isEnPassant: boolean): boolean {
        return move.targetPiece != Pieces.Empty && !isCastling && !isEnPassant;
    },

    modifyFullMoveNumber(board: IBoard, move: IMove, colour: Colour): void {
        if (colour == Colours.black) {
            board.fullMoveCounter += 1;
        }
    },

    modifyHalfMoveNumber(board: IBoard, move: IMove, colour: Colour, isCastling: boolean, isEnPassant: boolean): void {
        function reset() {
            board.halfMoveNumber = 0;
        }

        const inc = () => board.halfMoveNumber = board.halfMoveNumber + 1;

        if (Piece.isPawn(move.piece) || this.isAttack(board, move, colour, isCastling, isEnPassant)) {
            reset();
            return;
        }
        inc();
    },

    isCastlingMove(move: IMove): boolean {
        return (move.piece == Pieces.WhiteKing && move.targetPiece == Pieces.WhiteRook)
            || (move.piece == Pieces.BlackKing && move.targetPiece == Pieces.BlackRook);
    },

    makeCastle(boardPosition: BoardPosition, move: IMove): void {
        function setEmpty(n: number) {
            BoardPosition.setEmpty(boardPosition, n as SquareIndex);
        }

        function setPiece(n: number, piece: Piece) {
            BoardPosition.setPiece(boardPosition, n as SquareIndex, piece);
        }

        function setEmptyAll(...n: Array<number>): void {
            n.forEach((x: number) => BoardPosition.setEmpty(boardPosition, x));
        }

        if (move.from == 60 && move.to == 63) {
            setEmptyAll(60, 63);
            setPiece(61, Pieces.WhiteRook);
            setPiece(62, Pieces.WhiteKing);
        } else if (move.from == 4 && move.to == 7) {
            setEmptyAll(4, 7);
            setPiece(5, Pieces.BlackRook);
            setPiece(6, Pieces.BlackKing);
        } else if (move.from == 60 && move.to == 56) {
            setEmptyAll(56, 57, 60);
            setPiece(58, Pieces.WhiteKing);
            setPiece(59, Pieces.WhiteRook);
        } else if (move.from == 4 && move.to == 0) {
            setEmptyAll(0, 1, 4);
            setPiece(2, Pieces.BlackKing);
            setPiece(3, Pieces.BlackRook);
        }
    },

    isEnPassant(move: IMove): { fromX: number, targetX: number } | null {
        const fromX = Coords.toX(move.from);
        const targetX = Coords.toX(move.to);
        const fromY = Coords.toY(move.from);
        const toY = Coords.toY(move.to);

        const xValid = ((fromX + 1 == targetX) || (fromX - 1 == targetX));

        function yValid() {
            const colour = Piece.getColour(move.piece);
            if (colour == Colours.white) {
                return toY == fromY - 1;
            } else if (colour == Colours.black) {
                return toY == fromY + 1;
            }

            throw new Error("Colour can't be null. [moveMaker isEnPassant yValid]")
        }

        return Piece.isEmpty(move.targetPiece) && xValid && yValid() && Piece.isPawn(move.piece) ? {
            fromX: fromX,
            targetX: targetX
        } : null;
    },

    makeEnPassant(boardPosition: BoardPosition, move: IMove, fromX: number, targetX: number): void {
        const fromY = Coords.toY(move.from);

        function getEnemyPawnSquare(): SquareIndex {
            return Coords.toSquareIndex(targetX, fromY);
        }

        BoardPosition.setEmpty(boardPosition, move.from);
        BoardPosition.setEmpty(boardPosition, getEnemyPawnSquare());
        BoardPosition.setPiece(boardPosition, move.to, move.piece);
    },

    tryDisableCastling(board: IBoard, move: IMove, isCastling: boolean): void {
        if (Piece.isKing(move.piece)) {
            this.disableCastling(board, move);
        } else if (Piece.isRook(move.piece)) {
            if (move.from == 0 as SquareIndex) board.castling.black.queenSide = false;
            if (move.from == 7 as SquareIndex) board.castling.black.kingSide = false;
            if (move.from == 56 as SquareIndex) board.castling.white.queenSide = false;
            if (move.from == 63 as SquareIndex) board.castling.white.kingSide = false;
        }

        /* When the rook is captured, we also need to disable castling related with this rook. */
        else if (Piece.isRook(move.targetPiece)) {
            if (move.to == 0 as SquareIndex) board.castling.black.queenSide = false;
            if (move.to == 7 as SquareIndex) board.castling.black.kingSide = false;
            if (move.to == 56 as SquareIndex) board.castling.white.queenSide = false;
            if (move.to == 63 as SquareIndex) board.castling.white.kingSide = false;
        }
    },

    makeNormalMoveOnBoard(boardPosition: BoardPosition, move: IMove): void {
        BoardPosition.setPiece(boardPosition, move.to, move.piece);
        BoardPosition.setEmpty(boardPosition, move.from);

    },

    makeNormalMove(board: IBoard, boardPosition: BoardPosition, move: IMove): void {
        this.makeNormalMoveOnBoard(boardPosition, move);
        this.tryDisableCastling(board, move, false);
    },

    disableCastling(board: IBoard, move: IMove): void {
        const colour = Piece.getColour(move.piece);
        if (colour == null) throw new Error("Move.Piece can't be empty");
        const castling = colour == Colours.white ? board.castling.white : board.castling.black;
        castling.queenSide = false;
        castling.kingSide = false;
    },

    clearEnPassant(board: IBoard): void {
        board.enPassant = null;
    },

    makePromotionMove(boardPosition: BoardPosition, move: IMove): void {
        const colour = Piece.getColour(move.piece);

        function createPieceToSet(): Piece | never {
            if (move.promotion == undefined) {
                throw new Error("Need to specify move.promotion when you're pushing the promotion move.");
            }

            if (move.promotion == "knight") {
                return colour == Colours.white ? Pieces.WhiteKnight : Pieces.BlackKnight;
            } else if (move.promotion == "queen") {
                return colour == Colours.white ? Pieces.WhiteQueen : Pieces.BlackQueen;
            } else if (move.promotion == "rook") {
                return colour == Colours.white ? Pieces.WhiteRook : Pieces.BlackRook;
            } else if (move.promotion == "bishop") {
                return colour == Colours.white ? Pieces.WhiteBishop : Pieces.BlackBishop;
            }

            throw new Error("MoveMaker->makePromotionMove->createPieceToSet");
        }

        BoardPosition.setPiece(boardPosition, move.to, createPieceToSet());
        BoardPosition.setEmpty(boardPosition, move.from);
    },

    makeMove(board: IBoard, move: IMove): void {
        const boardPosition = board.position;

        // TODO: I'm getting an error move.piece is empty... [I don't know where]

        const colour = Piece.getColour(move.piece);
        if (colour == null) throw new Error("Move.Piece can't be null.");

        const enPassant = this.isEnPassant(move);

        const isCastling = this.isCastlingMove(move);

        if (isCastling) {
            this.makeCastle(boardPosition, move);
            this.disableCastling(board, move);
        } else if (move.promotion != undefined) {
            this.makePromotionMove(boardPosition, move);
        } else if (enPassant != null) {
            this.makeEnPassant(boardPosition, move, enPassant.fromX, enPassant.targetX);
        } else this.makeNormalMove(board, boardPosition, move);

        this.clearEnPassant(board);
        this.modifyFullMoveNumber(board, move, colour);
        this.tryDisableCastling(board, move, isCastling);
        this.modifyHalfMoveNumber(board, move, colour, isCastling, enPassant != null);
        this.trySetEnPassant(board, move);
        this.updateColourToMove(board, move, colour);
    },

    trySetEnPassant(board: IBoard, move: IMove): void {
        if (move.setEnPassant != null) board.enPassant = move.setEnPassant;
    }
};