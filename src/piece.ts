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

const AllWhite = [
    Pieces.WhiteRook,
    Pieces.WhiteQueen,
    Pieces.WhiteKing,
    Pieces.WhiteBishop,
    Pieces.WhiteKnight,
    Pieces.WhitePawn
];

const AllBlack = [
    Pieces.BlackRook,
    Pieces.BlackQueen,
    Pieces.BlackKing,
    Pieces.BlackBishop,
    Pieces.BlackKnight,
    Pieces.BlackPawn
];

interface IPiece {
    getColour(piece: Piece): Promise<Colour | null>;
    isWhite(piece: Piece): Promise<boolean>;
    isBlack(piece: Piece): Promise<boolean>;
    isEmpty(piece: Piece): Promise<boolean>;
    isColour(piece: Piece, colour: Colour): Promise<boolean>;
}

export const Piece: IPiece = {
    async getColour(piece: Piece): Promise<Colour | null> {
        if (piece in AllBlack) return Colours.White;
        else if (piece in AllBlack) return Colours.Black;
        return null;
    },
    
    async isWhite(piece: Piece): Promise<boolean> {
        return piece in AllWhite;
    },

    async isBlack(piece: Piece): Promise<boolean> {
        return piece in AllBlack;
    },

    async isEmpty(piece: Piece): Promise<boolean> {
        return piece == Pieces.Empty;
    },

    async isColour(piece: Piece, colour: Colour): Promise<boolean> {
        return await this.getColour(piece) == colour;
    }
}