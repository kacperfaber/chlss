import {fromFEN} from "./utils/boardUtils";
import {MoveGenerator} from "../src/moveGenerator";
import {Colours} from "../src/colour";
import {MoveMaker} from "../src/moveMaker";
import {SquareIndex} from "../src/square";
import {FEN} from "../src/fen";
import Pieces from "../src/pieces";

describe('moveMaker', function () {
    test('test - castling - scenario 1', async function () {
        const board = await fromFEN("r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1");
        const moves = await MoveGenerator.generateLegalMoves(board, Colours.white);
        await MoveMaker.makeMoveAsync(board, moves.find(m => m.from == 60 as SquareIndex && m.to == 63 as SquareIndex) !!);
        const str = await FEN.writeFEN(board);
        expect(str).toBe("r3k2r/8/8/8/8/8/8/R4RK1 b kq - 1 1");
    });

    test('test - castling - scenario 2', async function () {
        const board = await fromFEN("r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1");
        const moves = await MoveGenerator.generateLegalMoves(board, Colours.white);
        await MoveMaker.makeMoveAsync(board, moves.find(m => m.from == 60 as SquareIndex && m.to == 56 as SquareIndex) !!);
        const str = await FEN.writeFEN(board);
        expect(str).toBe("r3k2r/8/8/8/8/8/8/2KR3R b kq - 1 1");
    });

    test('test - castling - scenario 3', async function () {
        const board = await fromFEN("r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1");
        const moves = await MoveGenerator.generateLegalMoves(board, Colours.white);
        await MoveMaker.makeMoveAsync(board, moves.find(m => m.from == 60 as SquareIndex && m.to == 56 as SquareIndex) !!);
        const str = await FEN.writeFEN(board);
        expect(str).toBe("r3k2r/8/8/8/8/8/8/2KR3R b kq - 1 1");
    });

    test(`pawn move resets half move counter - scenario 1`, async function () {
        const board = await fromFEN("k7/8/8/8/8/4P3/K7/8 w - - 10 10");
        const moves = await MoveGenerator.generateLegalMoves(board, Colours.white);
        await MoveMaker.makeMoveAsync(board, moves.find(m => m.piece == Pieces.WhitePawn) !!);
        const str = await FEN.writeFEN(board);
        expect(str).toBe("k7/8/8/8/4P3/8/K7/8 b - - 0 10");
    });

    test(`black move increments full move number`, async function () {
        const board = await fromFEN("3k4/8/4K3/8/4P3/8/8/8 b - - 0 5");
        const moves = await MoveGenerator.generateLegalMoves(board, Colours.black);
        await MoveMaker.makeMoveAsync(board, moves.find(m => m.piece == Pieces.BlackKing) !!);
        expect(board.fullMoveCounter).toBe(6);
    });

    test(`white move does not increment full move number`, async function () {
        const board = await fromFEN("3k4/8/4K3/8/4P3/8/8/8 w - - 0 5");
        const moves = await MoveGenerator.generateLegalMoves(board, Colours.white);
        await MoveMaker.makeMoveAsync(board, moves.find(m => m.piece == Pieces.WhiteKing) !!);
        expect(board.fullMoveCounter).toBe(5);
    });

    test(`test - castling - undo -scenario 1`, async function () {
        const fen = "r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1";
        const board = await fromFEN(fen);
        const moves = await MoveGenerator.generateLegalMoves(board, Colours.white);
        const move = moves.find(m => m.from == 60 as SquareIndex && m.to == 63 as SquareIndex) !!;
        await MoveMaker.makeMoveOnBoard(board.position, move);
        expect(await FEN.writeFEN(board)).not.toBe(fen);
        await MoveMaker.undoMoveOnBoard(board.position, move)
        expect(await FEN.writeFEN(board)).toBe(fen);
    });
});