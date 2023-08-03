import {BoardPosition} from "./boardPosition";
import {Colour, Colours} from "./colour";
import {Castling} from "./castling";
import {SquareIndex} from "./square";

export interface IBoard {
    position: BoardPosition;
    toMove: Colour;
    castling: Castling;
    enPassant: SquareIndex | null;
    fullMoveCounter: number;
    halfMoveNumber: number;
}

export const Board = {
    createEmpty(): IBoard {
        return {
            fullMoveCounter: 1,
            halfMoveNumber: 0,
            enPassant: null,
            castling: {
                black: {
                    queenSide: false,
                    kingSide: false
                },

                white: {
                    queenSide: false,
                    kingSide: false
                }
            },
            toMove: Colours.white,
            position: BoardPosition.createEmptySynchronously()
        }
    },

    createDefault(): IBoard {
        return {
            fullMoveCounter: 1,
            halfMoveNumber: 0,
            enPassant: null,
            castling: Castling.createDefault(),
            toMove: Colours.white,
            position: BoardPosition.createDefaultSynchronously()
        }
    },

     createDefaultAsync(): IBoard {
        return {
            fullMoveCounter: 1,
            halfMoveNumber: 0,
            enPassant: null,
            castling: Castling.createDefault(),
            toMove: Colours.white,
            position:  BoardPosition.createDefault()
        }
    }
}