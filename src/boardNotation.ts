import {SquareIndex} from "./square";
import {Coords} from "./coords";

const BoardNotationChars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

export const BoardNotation = {
    toBoardNotation(squareIndex: SquareIndex): string {
        const x = Coords.toX(squareIndex);
        const y = Coords.toY(squareIndex);
        return `${BoardNotationChars[x]}${8 - y}`;
    },

    fromBoardNotation(boardNotation: string): SquareIndex {
        function error() {
            throw new Error("'fromBoardNotation' parsing error.");
        }
        const x = BoardNotationChars.indexOf(boardNotation[0]);
        if (x === -1) error();
        const y = parseInt(boardNotation[1]) - 1;
        if (y < 0 || y > 7) error();
        return Coords.toSquareIndex(x, 7 - y);
    }
};