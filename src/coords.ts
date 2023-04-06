import {SquareIndex} from "./square";

export type X = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type Y = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface ICoords {
    toSquareIndex(x: X, y: Y): SquareIndex;

    toX(squareIndex: SquareIndex): X;

    toY(squareIndex: SquareIndex): Y;
}

export const Coords: ICoords = {
    toSquareIndex(x: X, y: Y): SquareIndex {
        return ((y * 8) + x) as SquareIndex;
    },

    toX(squareIndex: SquareIndex): X {
        return Math.floor(squareIndex % 8) as X;
    },

    toY(squareIndex: SquareIndex): Y {
        return Math.floor(squareIndex / 8) as Y;
    }
}