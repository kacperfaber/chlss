import {fromFEN} from "./utils/boardUtils";
import {MoveGenerator} from "../src/moveGenerator";
import {Colours} from "../src/colour";
import {MoveMaker} from "../src/moveMaker";
import {SquareIndex} from "../src/square";
import {FEN} from "../src/fen";

describe('moveMaker', function () {
    test('test - castling - scenario 1', async function () {
        const board = await fromFEN("r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1");
        const moves = await MoveGenerator.generateLegalMoves(board, Colours.white);
        await MoveMaker.makeMoveAsync(board, moves.find(m => m.from == 60 as SquareIndex && m.to == 63 as SquareIndex) !!);
        const str = await FEN.writeFEN(board);
        expect(str).toBe("r3k2r/8/8/8/8/8/8/R4RK1 w KQkq - 0 1");
    });

    test('test - castling - scenario 2', async function () {
        const board = await fromFEN("r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1");
        const moves = await MoveGenerator.generateLegalMoves(board, Colours.white);
        await MoveMaker.makeMoveAsync(board, moves.find(m => m.from == 60 as SquareIndex && m.to == 56 as SquareIndex) !!);
        const str = await FEN.writeFEN(board);
        expect(str).toBe("r3k2r/8/8/8/8/8/8/2KR3R w KQkq - 0 1");
    });
});