import Pieces from "./pieces";
import {Colour, Colours} from "./colour";
import {SquareIndex} from "./square";
import {Coords} from "./coords";

export type Piece =
    typeof Pieces.BlackKing |
    typeof Pieces.WhiteKing |
    typeof Pieces.BlackBishop |
    typeof Pieces.WhiteBishop |
    typeof Pieces.WhiteQueen |
    typeof Pieces.BlackQueen |
    typeof Pieces.WhitePawn |
    typeof Pieces.BlackPawn |
    typeof Pieces.BlackKnight |
    typeof Pieces.WhiteKnight |
    typeof Pieces.WhiteRook |
    typeof Pieces.BlackRook |
    typeof Pieces.Empty;

interface IPiece {
    getColour(piece: Piece): Colour | null;
    isWhite(piece: Piece): boolean;
    isBlack(piece: Piece): boolean;
    isEmpty(piece: Piece): boolean;
    isColour(piece: Piece, colour: Colour): boolean;
    compareColour(colour1: Colour, colour2: Colour): boolean;
    isEnemy(piece: Piece, colour: Colour): boolean;
    allWhite: Array<Piece>;
    allBlack: Array<Piece>;
    isEnemy(piece: Piece, colour: Colour): boolean;
    isEnemyOrEmpty(piece: Piece, colour: Colour): boolean;
    isEnemyOrNull(piece: Piece, colour: Colour): boolean;
    isRook(piece: Piece): boolean;
    isPawn(piece: Piece): boolean;
    isQueen(piece: Piece): boolean;
    isBishop(piece: Piece): boolean;
    isKnight(piece: Piece): boolean;
    isKing(piece: Piece): boolean;
    isColourEnemyOrNull(tColour: Colour | null, colour: Colour): boolean
    getKing(colour: Colour): Piece;
    getPawn(colour: Colour): Piece;
    getColourSynchronously(piece: Piece): Colour | null;

    getRook(colour: Colour): Piece;

    getQueen(colour: Colour): Piece;

    getKnight(colour: Colour): Piece;

    getBishop(colour: Colour): Piece;

    getBishopSquareColour(i: SquareIndex): Colour;

    getBishopSquareColourByCoords(x: number, y: number): Colour;
}

export const Piece: IPiece = {
    getPawn(colour: Colour): Piece {
        return colour == Colours.white ? Pieces.WhitePawn : Pieces.BlackPawn;
    },

    getKing(colour: Colour): Piece {
        return colour == Colours.white ? Pieces.WhiteKing : Pieces.BlackKing;
    },

     isEnemyOrNull(piece: Piece | null, colour: Colour): boolean {
        if (piece == null) return true;
        const pieceColour = ( Piece.getColour(piece))!!;
        return !( Piece.compareColour(pieceColour, colour));
    },

     getColour(piece: Piece): Colour | null {
        if (this.allWhite.includes(piece)) return Colours.white;
        if (this.allBlack.includes(piece)) return Colours.black;
        return null;
    },

     isEnemy(piece: Piece, colour: Colour): boolean {
        const pieceColour =  this.getColour(piece);
        return pieceColour == Colours.inverseColour(colour);
    },

     isEnemyOrEmpty(piece: Piece, colour: Colour): boolean {
        if ( Piece.isEmpty(piece)) return true;
        return  this.isEnemy(piece, colour);
    },

     isColourEnemyOrNull(tColour: Colour | null, colour: Colour): boolean {
        if (tColour == null) return true;
        return ! Piece.compareColour(tColour, colour);
    },

     isWhite(piece: Piece): boolean {
        return this.allWhite.includes(piece);
    },

     isBlack(piece: Piece): boolean {
        return this.allBlack.includes(piece);
    },

     isEmpty(piece: Piece): boolean {
        return piece == Pieces.Empty;
    },

     isColour(piece: Piece, colour: Colour): boolean {
        return  this.getColour(piece) == colour;
    },

     compareColour(colour1: Colour, colour2: Colour): boolean {
        return colour1 == colour2;
    },

    isRook(piece: Piece): boolean {
        return piece == Pieces.WhiteRook || piece == Pieces.BlackRook;
    },

    isBishop(piece: Piece): boolean {
        return piece == Pieces.WhiteBishop || piece == Pieces.BlackBishop;
    },

    isKing(piece: Piece): boolean {
        return piece == Pieces.WhiteKing || piece == Pieces.BlackKing;
    },

    isKnight(piece: Piece): boolean {
        return piece == Pieces.WhiteKnight || piece == Pieces.BlackKnight;
    },

    isPawn(piece: Piece): boolean {
        return piece == Pieces.WhitePawn || piece == Pieces.BlackPawn;
    },

    isQueen(piece: Piece): boolean {
        return piece == Pieces.WhiteQueen || piece == Pieces.BlackQueen;
    },

    getBishopSquareColour(i: SquareIndex): Colour {
        return this.getBishopSquareColourByCoords(Coords.toX(i), Coords.toY(i));
    },

    getBishopSquareColourByCoords(x: number, y: number): Colour {
        return ((y + 1) % 2) - ((x + 1) % 2) == 0 ? Colours.white : Colours.black;
    },

    getBishop(colour: Colour): Piece {
        return colour == Colours.white ? Pieces.WhiteBishop : Pieces.BlackBishop;
    },

    getQueen(colour: Colour): Piece {
        return colour == Colours.white ? Pieces.WhiteQueen : Pieces.BlackQueen;
    },

    getRook(colour: Colour): Piece {
        return colour == Colours.white ? Pieces.WhiteRook : Pieces.BlackRook;
    },

    getKnight(colour: Colour): Piece {
        return colour == Colours.white ? Pieces.WhiteKing : Pieces.BlackKnight;
    },

    allWhite: [
        Pieces.WhiteRook,
        Pieces.WhiteQueen,
        Pieces.WhiteKing,
        Pieces.WhiteBishop,
        Pieces.WhiteKnight,
        Pieces.WhitePawn
    ],

    allBlack: [
        Pieces.BlackRook,
        Pieces.BlackQueen,
        Pieces.BlackKing,
        Pieces.BlackBishop,
        Pieces.BlackKnight,
        Pieces.BlackPawn
    ],

    getColourSynchronously(piece: Piece): Colour | null {
        if (this.allWhite.includes(piece)) return Colours.white;
        if (this.allBlack.includes(piece)) return Colours.black;
        return null;
    }
}