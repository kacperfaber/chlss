import {fromFEN} from "./utils/boardUtils";
import {MoveGenerator} from "../src/moveGenerator";
import {Colour, Colours} from "../src/colour";
import Pieces from "../src/pieces";
import {MoveMaker} from "../src/moveMaker";
import {FEN} from "../src/fen";

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
    {fen: "r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1", colour: Colours.white, expectedMoveLength: 26},
    {fen: "r3k2r/8/8/8/8/8/8/R3K2R b KQkq - 0 1", colour: Colours.black, expectedMoveLength: 26},
    {fen: "RR6/8/8/8/8/8/8/8 w - - 0 1", colour: Colours.white, expectedMoveLength: 20}
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

        // TODO Move test below from MoveGenerator test case.

        test(`promotion moves - move it from this test case`, async function () {
            const board = await fromFEN("8/7P/8/8/8/8/1k6/6K1 w - - 0 1");

            const moves = await MoveGenerator.generateLegalMoves(board, Colours.white);
            const pawnMove = moves.find(x => x.piece == Pieces.WhitePawn)!!;
            pawnMove.promotion = "queen";
            await MoveMaker.makeMoveAsync(board, pawnMove);
            expect(await FEN.writeFEN(board)).toBe("7Q/8/8/8/8/8/1k6/6K1 b - - 0 1");
        });
    });

});