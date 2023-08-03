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
     getAllPiecesByColour(boardPosition: BoardPosition, colour: Colour): Array<Piece> {
        return boardPosition.filter( function (p: Piece) {
            const pieceColour =  Piece.getColour(p);
            if (pieceColour == null) return false;
            return pieceColour == colour;
        }) as Array<Piece>;
    },

     createEmpty(): BoardPosition {
        return this.createEmptySynchronously();
    },

     copyAsync(boardPosition: BoardPosition): BoardPosition {
        const copy =  BoardPosition.createEmpty();
        for (let index = 0; index < 64; index++) {
            const squareIndex = index as SquareIndex;
             BoardPosition.setPiece(copy, squareIndex,  BoardPosition.getPiece(boardPosition, squareIndex));
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

     createDefault(): BoardPosition {
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

     isEmpty(boardPosition: BoardPosition, x: number, y: number): boolean {
        return  this.isSquareEmpty(boardPosition, Coords.toSquareIndex(x, y));
    },

     isSquareEmpty(boardPosition: BoardPosition, square: SquareIndex): boolean {
        return  Piece.isEmpty( this.getPiece(boardPosition, square));
    },

     isSquaresEmpty(boardPosition: BoardPosition, ...squares: Array<SquareIndex>): boolean {
        for (let index of squares) {
            if (!( this.isSquareEmpty(boardPosition, index))) return false;
        }
        return true;
    },

     setPiece(boardPosition: BoardPosition, square: SquareIndex, piece: Piece) {
        boardPosition[square] = piece;
    },


     getPiece(boardPosition: BoardPosition, square: SquareIndex): Piece {
        return boardPosition[square];
    },

     getPieceByCoords(boardPosition: BoardPosition, x: number, y: number): Piece {
        return boardPosition[Coords.toSquareIndex(x, y)];
    },

     getPieceOrNull(boardPosition: BoardPosition, square: SquareIndex): Piece | null {
        const piece =  this.getPiece(boardPosition, square);
        return piece == Pieces.Empty ? null : piece;
    },

     isInBoard(x: number, y: number): boolean {
        return x >= 0 && x <= 7 && y >= 0 && y <= 7;
    },

     isIndexInBoard(index: number): boolean {
        return index >= 0 && index <= 63;
    },

     isSquareUnderAttack(squareIndex: SquareIndex, moveList: Array<IMove>): boolean {
        return moveList.filter(function (move: IMove) {
            return move.to == squareIndex;
        }).length > 0;
    },

     isSquaresNotUnderAttack(enemyColour: Colour, moveList: Array<IMove>, boardPosition: BoardPosition, ...squareIndexes: Array<SquareIndex>): boolean {
        for (const move of moveList) {
            for (let squareIndex of squareIndexes) {
                if (squareIndex == move.to) return false;
            }
        }

         function isEnemyPawnLookingAt(enemyColour: Colour, square: SquareIndex): boolean {
            const yDiff: number = enemyColour == Colours.white ? 1 : -1;
            const x1 = Coords.toX(square) + 1;
            const x2 = Coords.toX(square) - 1;
            const y = Coords.toY(square) + yDiff;

            const _x1 =  BoardPosition.getPieceByCoords(boardPosition, x1, y);
            const _x2 =  BoardPosition.getPieceByCoords(boardPosition, x2, y);

            function isEnemyPawn(piece: Piece): boolean {
                return Piece.isPawn(piece) && Piece.getColourSynchronously(piece) == enemyColour;
            }

            if ( BoardPosition.isInBoard(x1, y)) {
                if (isEnemyPawn( BoardPosition.getPieceByCoords(boardPosition, x1, y))) return true;
            }

            if ( BoardPosition.isInBoard(x2, y)) {
                if (isEnemyPawn( BoardPosition.getPieceByCoords(boardPosition, x2, y))) return true;
            }

            return false;
        }

        for (const squareIndex of squareIndexes) {
            if ( isEnemyPawnLookingAt(enemyColour, squareIndex)) return false;
        }

        return true;
    }
};