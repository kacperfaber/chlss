export interface CastlingColour {
    queenSide: boolean;
    kingSide: boolean;
}

export interface Castling {
    white: CastlingColour;
    black: CastlingColour;
}