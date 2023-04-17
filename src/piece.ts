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
    allWhite: Array<Piece>;
    allBlack: Array<Piece>;

    getColour(piece: Piece): Promise<Colour | null>;

    isWhite(piece: Piece): Promise<boolean>;

    isBlack(piece: Piece): Promise<boolean>;

    isEmpty(piece: Piece): Promise<boolean>;

    isColour(piece: Piece, colour: Colour): Promise<boolean>;

    compareColour(colour1: Colour, colour2: Colour): Promise<boolean>;

    isEnemy(piece: Piece, colour: Colour): Promise<boolean>;

    isEnemy(piece: Piece, colour: Colour): Promise<boolean>;

    isEnemyOrEmpty(piece: Piece, colour: Colour): Promise<boolean>;

    isEnemyOrNull(piece: Piece, colour: Colour): Promise<boolean>;

    isRook(piece: Piece): boolean;

    isPawn(piece: Piece): boolean;

    isQueen(piece: Piece): boolean;

    isBishop(piece: Piece): boolean;

    isKnight(piece: Piece): boolean;

    isKing(piece: Piece): boolean;

    isColourEnemyOrNull(tColour: Colour | null, colour: Colour): Promise<boolean>;

    getKing(colour: Colour): Piece;

    getPawn(colour: Colour): Piece;

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

    async isEnemyOrNull(piece: Piece | null, colour: Colour): Promise<boolean> {
        if (piece == null) return true;
        const pieceColour = (await Piece.getColour(piece))!!;
        return !(await Piece.compareColour(pieceColour, colour));
    },

    async getColour(piece: Piece): Promise<Colour | null> {
        if (this.allWhite.includes(piece)) return Colours.white;
        if (this.allBlack.includes(piece)) return Colours.black;
        return null;
    },

    async isEnemy(piece: Piece, colour: Colour): Promise<boolean> {
        const pieceColour = await this.getColour(piece);
        return pieceColour == Colours.inverseColour(colour);
    },

    async isEnemyOrEmpty(piece: Piece, colour: Colour): Promise<boolean> {
        if (await Piece.isEmpty(piece)) return true;
        return await this.isEnemy(piece, colour);
    },

    async isColourEnemyOrNull(tColour: Colour | null, colour: Colour): Promise<boolean> {
        if (tColour == null) return true;
        return !await Piece.compareColour(tColour, colour);
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
    ]
};