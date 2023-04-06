import Pieces from "./pieces";
import {Colour, Colours} from "./colour";

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
    getColour(piece: Piece): Promise<Colour | null>;
    isWhite(piece: Piece): Promise<boolean>;
    isBlack(piece: Piece): Promise<boolean>;
    isEmpty(piece: Piece): Promise<boolean>;
    isColour(piece: Piece, colour: Colour): Promise<boolean>;
    compareColour(colour1: Colour, colour2: Colour): Promise<boolean>;
    allWhite: Array<Piece>;
    allBlack: Array<Piece>;
}

export const Piece: IPiece = {
    async getColour(piece: Piece): Promise<Colour | null> {
        if (this.allWhite.includes(piece)) return Colours.White;
        if (this.allBlack.includes(piece)) return Colours.Black;
        return null;
    },
    
    async isWhite(piece: Piece): Promise<boolean> {
        return this.allWhite.includes(piece);
    },

    async isBlack(piece: Piece): Promise<boolean> {
        return this.allBlack.includes(piece);
    },

    async isEmpty(piece: Piece): Promise<boolean> {
        return piece == Pieces.Empty;
    },

    async isColour(piece: Piece, colour: Colour): Promise<boolean> {
        return await this.getColour(piece) == colour;
    },

    async compareColour(colour1: Colour, colour2: Colour): Promise<boolean> {
        return colour1 == colour2;
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
    ]
}