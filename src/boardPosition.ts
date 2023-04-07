import {Piece} from "./piece";
import Pieces from "./pieces";
import {SquareIndex} from "./square";
import {Coords} from "./coords";
import {IMove} from "./move";

export type BoardPosition = [
    Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece,
    Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece,
    Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece,
    Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece,
    Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece,
    Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece,
    Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece,
    Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece
];

export const BoardPosition = {
    async createEmpty(): Promise<BoardPosition> {
        return this.createEmptySynchronously();
    },

    setEmpty(boardPosition: BoardPosition, square: number) {
        boardPosition[square] = Pieces.Empty;
    },

    createEmptySynchronously(): BoardPosition {
        let boardArray = new Array<Piece>();
        for (let x = 0; x < 64; x++) {
            boardArray.push(Pieces.Empty);
        }
        return boardArray as BoardPosition;
    },

    async createDefault(): Promise<BoardPosition> {
        return this.createDefaultSynchronously();
    },

    createDefaultSynchronously(): BoardPosition {
        return [Pieces.BlackRook, Pieces.BlackKnight, Pieces.BlackBishop, Pieces.BlackQueen, Pieces.BlackKing, Pieces.BlackBishop, Pieces.BlackKnight, Pieces.BlackRook,
            Pieces.BlackPawn, Pieces.BlackPawn, Pieces.BlackPawn, Pieces.BlackPawn, Pieces.BlackPawn, Pieces.BlackPawn, Pieces.BlackPawn, Pieces.BlackPawn,
            Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty,
            Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty,
            Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty,
            Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty, Pieces.Empty,
            Pieces.WhitePawn, Pieces.WhitePawn, Pieces.WhitePawn, Pieces.WhitePawn, Pieces.WhitePawn, Pieces.WhitePawn, Pieces.WhitePawn, Pieces.WhitePawn,
            Pieces.WhiteRook, Pieces.WhiteKnight, Pieces.WhiteBishop, Pieces.WhiteQueen, Pieces.WhiteKing, Pieces.WhiteBishop, Pieces.WhiteKnight, Pieces.WhiteRook
        ];
    },

    async isEmpty(boardPosition: BoardPosition, x: number, y: number): Promise<boolean> {
        return await this.getPieceOrNull(boardPosition, Coords.toSquareIndex(x, y)) == null;
    },

    async isSquareEmpty(boardPosition: BoardPosition, square: SquareIndex): Promise<boolean> {
        return (await this.getPieceOrNull(boardPosition, square)) == null;
    },

    async isSquaresEmpty(boardPosition: BoardPosition, ...squares: Array<SquareIndex>): Promise<boolean> {
        for (let index of squares) {
            if (!(await this.isSquareEmpty(boardPosition, index))) return false;
        }
        return true;
    },

    async setPiece(boardPosition: BoardPosition, square: SquareIndex, piece: Piece) {
        boardPosition[square] = piece;
    },

    async getPiece(boardPosition: BoardPosition, square: SquareIndex): Promise<Piece> {
        return boardPosition[square];
    },

    async getPieceByCoords(boardPosition: BoardPosition, x: number, y: number): Promise<Piece> {
        return boardPosition[Coords.toSquareIndex(x, y)];
    },

    async getPieceOrNull(boardPosition: BoardPosition, square: SquareIndex): Promise<Piece | null> {
        return await this.getPiece(boardPosition, square) ?? null;
    },

    async isInBoard(x: number, y: number): Promise<boolean> {
        return x >= 0 && x <= 7 && y >= 0 && y <= 7;
    },

    async isIndexInBoard(index: number): Promise<boolean> {
        return index >= 0 && index <= 63;
    },

    async isSquareUnderAttack(squareIndex: SquareIndex, moveList: Array<IMove>): Promise<boolean> {
        return moveList.filter(function (move: IMove) {
            return move.to == squareIndex;
        }).length > 0;
    },

    async isSquaresNotUnderAttack(moveList: Array<IMove>, ...squareIndexes: Array<SquareIndex>): Promise<boolean> {
        moveList.forEach(function (move: IMove) {
            for (let squareIndex of squareIndexes) {
                if (squareIndex == move.to) return false;
            }
        });

        return true;
    }
};