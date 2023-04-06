import {Piece} from "./piece";
import Pieces from "./pieces";
import {SquareIndex} from "./square";

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

    async setPiece(boardPosition: BoardPosition, square: SquareIndex, piece: Piece) {
        boardPosition[square] = piece;
    },

    async getPiece(boardPosition: BoardPosition, square: SquareIndex): Promise<Piece> {
        return boardPosition[square];
    },

    async getPieceOrNull(boardPosition: BoardPosition, square: SquareIndex): Promise<Piece | null> {
        return await this.getPiece(boardPosition, square) ?? null;
    }
}