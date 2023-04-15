import {IMove} from "./move";
import {BoardPosition} from "./boardPosition";
import Pieces from "./pieces";
import {SquareIndex} from "./square";
import {Piece} from "./piece";
import {Coords} from "./coords";
import {IBoard} from "./board";

export const MoveMaker = {
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

    async makeNormalMove(board: IBoard, boardPosition: BoardPosition, move: IMove): Promise<void> {
        await BoardPosition.setPiece(boardPosition, move.to, move.piece);
        BoardPosition.setEmpty(boardPosition, move.from);
    },

    async makeMoveAsync(board: IBoard, move: IMove): Promise<void> {
        const boardPosition = board.position;

        if (await this.isCastlingMove(move)) {
            await this.makeCastle(boardPosition, move);
            return;
        }

        const enPassant = await this.isEnPassant(move);

        if (enPassant != null) {
            await this.makeEnPassant(boardPosition, move, enPassant.fromX, enPassant.targetX);
            return;
        }

        await this.makeNormalMove(board, boardPosition, move);

        /*
        TODO: Here I don't have many things like modify board state.
        - counters
        - 'setEnPassant' moves.
        - mates, pats...
        - castlings

         */
    }
};