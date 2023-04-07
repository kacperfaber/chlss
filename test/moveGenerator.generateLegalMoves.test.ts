import {fromFEN} from "./utils/boardUtils";
import {MoveGenerator} from "../src/moveGenerator";
import {Colour, Colours} from "../src/colour";

type Test = {fen: string, colour: Colour, expectedMoveLength: number};

const Tests: Array<Test> = [
    {
        fen: "k7/8/8/8/8/8/8/K7 w - - 0 1",
        colour: Colours.white,
        expectedMoveLength: 3
    },

    {
        fen: "8/8/8/8/8/8/PP6/8 w - - 0 1",
        colour: Colours.white,
        expectedMoveLength: 3
    },

    {
        fen: "8/8/8/8/8/2p5/PP6/8 w - - 0 1",
        colour: Colours.white,
        expectedMoveLength: 5
    },

    {
        fen: "7k/8/8/3K4/8/8/8/8 w - - 0 1",
        colour: Colours.white,
        expectedMoveLength: 8
    },

    {
        fen: "R7/8/8/8/8/8/8/8 w - - 0 1",
        colour: Colours.white,
        expectedMoveLength: 14
    },

    {
        fen: "R2R4/8/8/8/8/8/8/8 w - - 0 1",
        colour: Colours.white,
        expectedMoveLength: 22
    }
]

describe('moveGenerator.ts', function () {

    describe('generateLegalMoves', function () {

        test(`does not throw`, async function() {
            const board = await fromFEN("k7/8/8/8/8/8/8/K7 w - - 0 1");

            await MoveGenerator.generateLegalMoves(board, Colours.white);
        });

        Tests.forEach(function (t: Test) {
            test(`FEN: '${t.fen}' COLOUR: '${t.colour}'`, async function () {
                const board = await fromFEN("k7/8/8/8/8/8/8/K7 w - - 0 1");

                const moves = await MoveGenerator.generateLegalMoves(board, Colours.white);
                expect(moves.length).toBe(t.expectedMoveLength);
            });
        });

    });

});