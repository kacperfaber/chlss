import {fromFEN} from "./utils/boardUtils";
import {MoveGenerator} from "../src/moveGenerator";
import {Colour, Colours} from "../src/colour";

type Test = { fen: string, colour: Colour, expectedMoveLength: number };

const Tests: Array<Test> = [
    {
        fen: "k7/8/8/8/8/8/8/K7 w - - 0 1",
        colour: Colours.white,
        expectedMoveLength: 3
    },

    {
        fen: "8/8/8/8/8/8/PP6/8 w - - 0 1",
        colour: Colours.white,
        expectedMoveLength: 4
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
    },

    {
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        colour: Colours.white,
        expectedMoveLength: 20
    },

    {
        fen: "7k/8/8/8/3r4/3Q4/3K4/8 w - - 0 1",
        colour: Colours.white,
        expectedMoveLength: 8
    },

    {
        fen: "6rk/8/8/8/8/8/8/R7 w - - 0 1",
        colour: Colours.white,
        expectedMoveLength: 14
    },

    {
        fen: "6rk/8/8/8/8/8/8/Q7 w - - 0 1",
        colour: Colours.white,
        expectedMoveLength: 21
    },

    {fen: "7k/8/8/8/3r4/3R4/3K4/8 w - - 0 1", colour: Colours.white, expectedMoveLength: 8},
    {fen: "1q6/8/8/8/8/8/K7/8 w - - 0 1", colour: Colours.white, expectedMoveLength: 2},
    {fen: "2q5/8/8/8/8/8/K7/8 w - - 0 1", colour: Colours.white, expectedMoveLength: 5},
    {fen: "1q6/8/8/8/8/4r3/K7/4r3 w - - 0 1", colour: Colours.white, expectedMoveLength: 0},
    {fen: "1q6/8/8/8/8/r7/K7/4r3 w - - 0 1", colour: Colours.white, expectedMoveLength: 1},
];

describe('moveGenerator.ts', function () {

    describe('generateLegalMoves', function () {

        test(`does not throw`, async function () {
            const board = await fromFEN("k7/8/8/8/8/8/8/K7 w - - 0 1");

            await MoveGenerator.generateLegalMoves(board, Colours.white);
        });

        Tests.forEach(function (t: Test) {
            test(`FEN: '${t.fen}' COLOUR: '${t.colour}'`, async function () {
                const board = await fromFEN(t.fen);

                const moves = await MoveGenerator.generateLegalMoves(board, Colours.white);
                expect(moves.length).toBe(t.expectedMoveLength);
            });
        });

        test(`illegal moves`, async function () {
            const board = await fromFEN("8/8/r7/R7/K7/8/8/8 w - - 0 1");

            const moves = await MoveGenerator.generateLegalMoves(board, Colours.white);
            expect(moves.length).toBe(0);
        });
    });

});