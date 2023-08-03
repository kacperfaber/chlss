import {fromFEN} from "./utils/boardUtils";
import {MoveGenerator} from "../src/moveGenerator";
import {Colours} from "../src/colour";
import {MoveMaker} from "../src/moveMaker";
import {SquareIndex} from "../src/square";
import {FEN} from "../src/fen";
import Pieces from "../src/pieces";

describe('moveMaker', function () {
    test('test - castling - scenario 1',  function () {
        const board =  fromFEN("r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1");
        const moves =  MoveGenerator.generateLegalMoves(board, Colours.white);
         MoveMaker.makeMove(board, moves.find(m => m.from == 60 as SquareIndex && m.to == 63 as SquareIndex) !!);
        const str =  FEN.writeFEN(board);
        expect(str).toBe("r3k2r/8/8/8/8/8/8/R4RK1 b kq - 1 1");
    });

    test('test - castling - scenario 2',  function () {
        const board =  fromFEN("r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1");
        const moves =  MoveGenerator.generateLegalMoves(board, Colours.white);
         MoveMaker.makeMove(board, moves.find(m => m.from == 60 as SquareIndex && m.to == 56 as SquareIndex) !!);
        const str =  FEN.writeFEN(board);
        expect(str).toBe("r3k2r/8/8/8/8/8/8/2KR3R b kq - 1 1");
    });

    test('test - castling - scenario 3',  function () {
        const board =  fromFEN("r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1");
        const moves =  MoveGenerator.generateLegalMoves(board, Colours.white);
         MoveMaker.makeMove(board, moves.find(m => m.from == 60 as SquareIndex && m.to == 56 as SquareIndex) !!);
        const str =  FEN.writeFEN(board);
        expect(str).toBe("r3k2r/8/8/8/8/8/8/2KR3R b kq - 1 1");
    });

    test(`pawn move resets half move counter - scenario 1`,  function () {
        const board =  fromFEN("k7/8/8/8/8/4P3/K7/8 w - - 10 10");
        const moves =  MoveGenerator.generateLegalMoves(board, Colours.white);
         MoveMaker.makeMove(board, moves.find(m => m.piece == Pieces.WhitePawn) !!);
        const str =  FEN.writeFEN(board);
        expect(str).toBe("k7/8/8/8/4P3/8/K7/8 b - - 0 10");
    });

    test(`black move increments full move number`,  function () {
        const board =  fromFEN("3k4/8/4K3/8/4P3/8/8/8 b - - 0 5");
        const moves =  MoveGenerator.generateLegalMoves(board, Colours.black);
         MoveMaker.makeMove(board, moves.find(m => m.piece == Pieces.BlackKing) !!);
        expect(board.fullMoveCounter).toBe(6);
    });

    test(`white move does not increment full move number`,  function () {
        const board =  fromFEN("3k4/8/4K3/8/4P3/8/8/8 w - - 0 5");
        const moves =  MoveGenerator.generateLegalMoves(board, Colours.white);
         MoveMaker.makeMove(board, moves.find(m => m.piece == Pieces.WhiteKing) !!);
        expect(board.fullMoveCounter).toBe(5);
    });

    test(`test - castling - undo -scenario 1`,  function () {
        const fen = "r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1";
        const board =  fromFEN(fen);
        const moves =  MoveGenerator.generateLegalMoves(board, Colours.white);
        const move = moves.find(m => m.from == 60 as SquareIndex && m.to == 63 as SquareIndex) !!;
         MoveMaker.makeMoveOnBoard(board.position, move);
        expect( FEN.writeFEN(board)).not.toBe(fen);
         MoveMaker.undoMoveOnBoard(board.position, move)
        expect( FEN.writeFEN(board)).toBe(fen);
    });

    test(`king white castling`,  function() {
        const board =  fromFEN("r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1");
        const moves =  MoveGenerator.generateLegalMoves(board, Colours.white);
        const move = moves.find(m => m.from == 60 as SquareIndex && m.to == 63 as SquareIndex) !!;
         MoveMaker.makeMove(board, move);
        expect( FEN.writeFEN(board)).toBe("r3k2r/8/8/8/8/8/8/R4RK1 b kq - 1 1");
    });

    test(`queen white castling`,  function() {
        const board =  fromFEN("r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1");
        const moves =  MoveGenerator.generateLegalMoves(board, Colours.white);
        const move = moves.find(m => m.from == 60 as SquareIndex && m.to == 56 as SquareIndex) !!;
         MoveMaker.makeMove(board, move);
        expect( FEN.writeFEN(board)).toBe("r3k2r/8/8/8/8/8/8/2KR3R b kq - 1 1");
    });

    test(`king black castling`,  function() {
        const board =  fromFEN("r3k2r/8/8/8/8/8/8/R3K2R b KQkq - 0 1");
        const moves =  MoveGenerator.generateLegalMoves(board, Colours.black);
        const move = moves.find(m => m.from == 4 as SquareIndex && m.to == 7 as SquareIndex) !!;
         MoveMaker.makeMove(board, move);
        expect( FEN.writeFEN(board)).toBe("r4rk1/8/8/8/8/8/8/R3K2R w KQ - 1 2");
    });

    /*

    TODO: When I was testing with wrong position I was getting an error from MoveMaker.makeMoveAsync() - piece can't be undefined.
        something like that. I don't know why?

     */

    test(`queen black castling`,  function() {
        const board =  fromFEN("r3k2r/8/8/8/8/8/8/R3K2R b KQkq - 0 1");
        const moves =  MoveGenerator.generateLegalMoves(board, Colours.black);
        const move = moves.find(m => m.from == 4 as SquareIndex && m.to == 0 as SquareIndex) !!;
         MoveMaker.makeMove(board, move);
        expect( FEN.writeFEN(board)).toBe("2kr3r/8/8/8/8/8/8/R3K2R w KQ - 1 2");
    });

    test("en passant - scenario 1",  function() {
        const board =  fromFEN("r1bqkbnr/ppppp1pp/n7/4Pp2/8/8/PPPP1PPP/RNBQKBNR w KQkq f6 0 3");
        const moves =  MoveGenerator.generateLegalMoves(board, Colours.white);
        const move = moves.find(m => m.from == 28 as SquareIndex && m.to == 21 as SquareIndex && m.targetPiece == Pieces.Empty) !!;
         MoveMaker.makeMove(board, move);
        expect( FEN.writeFEN(board)).toBe("r1bqkbnr/ppppp1pp/n4P2/8/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 3");
    });

    test("en passant - scenario 2",  function() {
        const board =  fromFEN("k7/8/8/8/4pP2/8/8/K7 b - f3 0 1");
        const moves =  MoveGenerator.generateLegalMoves(board, Colours.black);
        const move = moves.find(({from, to, piece}) => piece == Pieces.BlackPawn && to == from + 9) !!;
         MoveMaker.makeMove(board, move);
        expect( FEN.writeFEN(board)).toBe("k7/8/8/8/8/5p2/8/K7 w - - 0 2");
    });
});