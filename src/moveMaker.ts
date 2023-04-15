import {IMove} from "./move";
import {BoardPosition} from "./boardPosition";
import Pieces from "./pieces";
import {SquareIndex} from "./square";
import {Piece} from "./piece";
import {Coords} from "./coords";
import {IBoard} from "./board";
import {Colour, Colours} from "./colour";

export interface IMoveMaker {
    isCastlingMove(move: IMove): Promise<boolean>;

    makeCastle(boardPosition: BoardPosition, move: IMove): Promise<void>;

    isEnPassant(move: IMove): Promise<{ fromX: number, targetX: number } | null>;

    makeNormalMove(board: IBoard, boardPosition: BoardPosition, move: IMove): Promise<void>;

    makeMoveAsync(board: IBoard, move: IMove): Promise<void>;

    makeEnPassant(boardPosition: BoardPosition, move: IMove, fromX: number, targetX: number): Promise<void>;

    disableCastling(board: IBoard, move: IMove): Promise<void>;

    clearEnPassant(board: IBoard): Promise<void>;

    modifyFullMoveNumber(board: IBoard, move: IMove, colour: Colour): Promise<void>;

    modifyHalfMoveNumber(board: IBoard, move: IMove, colour: Colour): Promise<void>;

    isAttack(board: IBoard, move: IMove, colour: Colour): Promise<boolean>;

    makeNormalMoveOnBoard(boardPosition: BoardPosition, move: IMove): Promise<void>;

    trySetEnPassant(board: IBoard, move: IMove): Promise<void>;

    tryDisableCastling(board: IBoard, move: IMove, isCastling: boolean): Promise<void>;

    updateColourToMove(board: IBoard, move: IMove, colour: Colour): Promise<void>;
}

export const MoveMaker: IMoveMaker = {
    async updateColourToMove(board: IBoard, move: IMove, colour: Colour): Promise<void> {
        board.toMove = Colours.inverseColour(colour);
    },


    async isAttack(board: IBoard, move: IMove, colour: Colour): Promise<boolean> {
        // TODO: How to do this with en passant and castlings?
        return false;
    },

    async modifyFullMoveNumber(board: IBoard, move: IMove, colour: Colour): Promise<void> {
        if (colour == Colours.black) {
            board.fullMoveCounter += 1;
        }
    },

    async modifyHalfMoveNumber(board: IBoard, move: IMove, colour: Colour): Promise<void> {
        function reset() {
            board.halfMoveNumber = 0;
        }

        const inc = () => board.halfMoveNumber = board.halfMoveNumber + 1;

        if (Piece.isPawn(move.piece) || await this.isAttack(board, move, colour)) {
            reset();
            return;
        }
        inc();
    },

    async isCastlingMove(move: IMove): Promise<boolean> {
        return (move.piece == Pieces.WhiteKing && move.targetPiece == Pieces.WhiteRook)
            || (move.piece == Pieces.BlackKing && move.targetPiece == Pieces.BlackRook);
    },

    async makeCastle(boardPosition: BoardPosition, move: IMove): Promise<void> {
        function setEmpty(n: number) {
            BoardPosition.setEmpty(boardPosition, n as SquareIndex);
        }

        async function setPiece(n: number, piece: Piece) {
            await BoardPosition.setPiece(boardPosition, n as SquareIndex, piece);
        }

        async function setEmptyAll(...n: Array<number>): Promise<void> {
            n.forEach((x: number) => BoardPosition.setEmpty(boardPosition, x));
        }

        if (move.from == 60 && move.to == 63) {
            await Promise.all([
                setEmptyAll(60, 63),
                setPiece(61, Pieces.WhiteRook),
                setPiece(62, Pieces.WhiteKing)
            ]);
        } else if (move.from == 4 && move.to == 7) {
            await Promise.all([
                setEmptyAll(4, 7),
                setPiece(5, Pieces.BlackRook),
                setPiece(6, Pieces.BlackKing)
            ]);
        } else if (move.from == 60 && move.to == 56) {
            await Promise.all([
                setEmptyAll(56, 57, 60),
                setPiece(58, Pieces.WhiteKing),
                setPiece(59, Pieces.WhiteRook)
            ]);
        } else if (move.from == 4 && move.to == 0) {
            await Promise.all([
                setEmptyAll(0, 1, 4),
                setPiece(2, Pieces.BlackKing),
                setPiece(3, Pieces.BlackRook)
            ]);
        }
    },

    async isEnPassant(move: IMove): Promise<{ fromX: number, targetX: number } | null> {
        const fromX = Coords.toX(move.from);
        const targetX = Coords.toX(move.to);
        return ((fromX + 1 == targetX) && (fromX - 1 == targetX)) ? {fromX: fromX, targetX: targetX} : null;
    },

    async makeEnPassant(boardPosition: BoardPosition, move: IMove, fromX: number, targetX: number): Promise<void> {
        const fromY = Coords.toY(move.from);

        function getEnemyPawnSquare(): SquareIndex {
            return Coords.toSquareIndex(targetX, fromY);
        }

        BoardPosition.setEmpty(boardPosition, move.from);
        BoardPosition.setEmpty(boardPosition, getEnemyPawnSquare());
        await BoardPosition.setPiece(boardPosition, move.to, move.piece);
    },

    async tryDisableCastling(board: IBoard, move: IMove, isCastling: boolean): Promise<void> {
        if (Piece.isKing(move.piece)) {
            await this.disableCastling(board, move);
        } else if (Piece.isRook(move.piece)) {
            if (move.from == 0 as SquareIndex) board.castling.black.queenSide = false;
            if (move.from == 7 as SquareIndex) board.castling.black.kingSide = false;
            if (move.from == 56 as SquareIndex) board.castling.white.queenSide = false;
            if (move.from == 63 as SquareIndex) board.castling.white.kingSide = false;
        }
    },

    async makeNormalMoveOnBoard(boardPosition: BoardPosition, move: IMove): Promise<void> {
        await BoardPosition.setPiece(boardPosition, move.to, move.piece);
        BoardPosition.setEmpty(boardPosition, move.from);

    },

    async makeNormalMove(board: IBoard, boardPosition: BoardPosition, move: IMove): Promise<void> {
        await this.makeNormalMoveOnBoard(boardPosition, move);
        await this.tryDisableCastling(board, move, false);
    },

    async disableCastling(board: IBoard, move: IMove): Promise<void> {
        const colour = await Piece.getColour(move.piece);
        if (colour == null) throw new Error("Move.Piece can't be empty");
        const castling = colour == Colours.white ? board.castling.white : board.castling.black;
        castling.queenSide = false;
        castling.kingSide = false;
    },

    async clearEnPassant(board: IBoard): Promise<void> {
        board.enPassant = null;
    },

    async makeMoveAsync(board: IBoard, move: IMove): Promise<void> {
        const boardPosition = board.position;

        const colour = await Piece.getColour(move.piece);
        if (colour == null) throw new Error("Move.Piece can't be null.");

        const enPassant = await this.isEnPassant(move);

        const isCastling = await this.isCastlingMove(move);

        if (isCastling) {
            await this.makeCastle(boardPosition, move);
            await this.disableCastling(board, move);
        } else if (enPassant != null) {
            await this.makeEnPassant(boardPosition, move, enPassant.fromX, enPassant.targetX);
            await this.clearEnPassant(board);
        } else await this.makeNormalMove(board, boardPosition, move);

        await Promise.all([
            this.modifyFullMoveNumber(board, move, colour),
            this.tryDisableCastling(board, move, isCastling),
            this.modifyHalfMoveNumber(board, move, colour),
            this.trySetEnPassant(board, move),
            this.updateColourToMove(board, move, colour)
        ]);

        /*
        TODO: Here I don't have many things like modify board state.
        - counters
        - 'setEnPassant' moves.
        - mates, pats...
        - castlings

         */
    },

    async trySetEnPassant(board: IBoard, move: IMove): Promise<void> {
        if (move.setEnPassant != null) board.enPassant = move.setEnPassant;
    }
};