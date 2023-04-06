import {SquareIndex} from "./square";

interface ICoords {
    toSquareIndex(x: number, y: number): SquareIndex;

    toX(squareIndex: SquareIndex): number;

    toY(squareIndex: SquareIndex): number;
}

export const Coords: ICoords = {
    toSquareIndex(x: number, y: number): SquareIndex {
        return ((y * 8) + x) as SquareIndex;
    },

    toX(squareIndex: SquareIndex): number {
        return Math.floor(squareIndex % 8);
    },

    toY(squareIndex: SquareIndex): number {
        return Math.floor(squareIndex / 8);
    }
}