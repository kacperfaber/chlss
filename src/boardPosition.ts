import {Piece} from "./piece";
import Pieces from "./pieces";
import {SquareIndex} from "./square";
import {Coords} from "./coords";
import {IMove} from "./move";
import {Colour, Colours} from "./colour";

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
    async getAllPiecesByColour(boardPosition: BoardPosition, colour: Colour): Promise<Array<Piece>> {
        return boardPosition.filter(async function (p: Piece) {
            const pieceColour = await Piece.getColour(p);
            if (pieceColour == null) return false;
            return pieceColour == colour;
        }) as Array<Piece>;
    },

    async createEmpty(): Promise<BoardPosition> {
        return this.createEmptySynchronously();
    },

    async copyAsync(boardPosition: BoardPosition): Promise<BoardPosition> {
        const copy = await BoardPosition.createEmpty();
        for (let index = 0; index < 64; index++) {
            const squareIndex = index as SquareIndex;
            await BoardPosition.setPiece(copy, squareIndex, await BoardPosition.getPiece(boardPosition, squareIndex));
        }
        return copy;
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
        return await this.isSquareEmpty(boardPosition, Coords.toSquareIndex(x, y));
    },

    async isSquareEmpty(boardPosition: BoardPosition, square: SquareIndex): Promise<boolean> {
        return await Piece.isEmpty(await this.getPiece(boardPosition, square));
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
        const piece = await this.getPiece(boardPosition, square);
        return piece == Pieces.Empty ? null : piece;
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

    async isSquaresNotUnderAttack(enemyColour: Colour, moveList: Array<IMove>, boardPosition: BoardPosition, ...squareIndexes: Array<SquareIndex>): Promise<boolean> {
        for (const move of moveList) {
            for (let squareIndex of squareIndexes) {
                if (squareIndex == move.to) return false;
            }
        }

        async function isEnemyPawnLookingAt(enemyColour: Colour, square: SquareIndex): Promise<boolean> {
            const yDiff: number = enemyColour == Colours.white ? 1 : -1;
            const x1 = Coords.toX(square) + 1;
            const x2 = Coords.toX(square) - 1;
            const y = Coords.toY(square) + yDiff;

            const _x1 = await BoardPosition.getPieceByCoords(boardPosition, x1, y);
            const _x2 = await BoardPosition.getPieceByCoords(boardPosition, x2, y);

            function isEnemyPawn(piece: Piece): boolean {
                return Piece.isPawn(piece) && Piece.getColourSynchronously(piece) == enemyColour;
            }

            if (await BoardPosition.isInBoard(x1, y)) {
                if (isEnemyPawn(await BoardPosition.getPieceByCoords(boardPosition, x1, y))) return true;
            }

            if (await BoardPosition.isInBoard(x2, y)) {
                if (isEnemyPawn(await BoardPosition.getPieceByCoords(boardPosition, x2, y))) return true;
            }

            return false;
        }

        for (const squareIndex of squareIndexes) {
            if (await isEnemyPawnLookingAt(enemyColour, squareIndex)) return false;
        }

        return true;
    }
};