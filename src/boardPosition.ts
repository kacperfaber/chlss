import {Piece} from "./piece";
import Pieces from "./pieces";
import {SquareIndex} from "./square";
import {Coords} from "./coords";

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

export const BoardPosition= {
    async createEmpty(): Promise<BoardPosition> {
        let boardArray = new Array<Piece>();
        for (let x = 0; x < 64; x++) {
            boardArray.push(Pieces.Empty);
        }
        return boardArray as BoardPosition;
    },

    async isEmpty(boardPosition: BoardPosition, x: number, y: number): Promise<boolean> {
        return await this.getPieceOrNull(boardPosition, Coords.toSquareIndex(x, y)) == null;
    },

    async isSquareEmpty(boardPosition: BoardPosition, square: SquareIndex): Promise<boolean> {
        return (await this.getPieceOrNull(boardPosition, square)) == null;
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
    }
}