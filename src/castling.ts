export interface CastlingColour {
    queenSide: boolean;
    kingSide: boolean;
}

export interface Castling {
    white: CastlingColour;
    black: CastlingColour;
}

export const Castling = {
    createDefault(): Castling {
        return {white: {kingSide: true, queenSide: true}, black: {kingSide: true, queenSide: true}};
    }
}