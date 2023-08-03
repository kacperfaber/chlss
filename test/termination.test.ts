import {fromFEN} from "./utils/boardUtils";
import {MoveGenerator} from "../src/moveGenerator";
import {Colours} from "../src/colour";
import {TerminationApi, Terminations} from "../src/termination";

describe('termination.ts', function () {
    describe('getTermination', function () {
        test(`returns mate if expected`,  function() {
            const board =  fromFEN("qqqqqqqq/8/8/8/8/8/8/K7 w - - 0 1");
            const legalMoves =  MoveGenerator.generateLegalMoves(board, Colours.white);
            const enemyMoves =  MoveGenerator.generateLegalMoves(board, Colours.black);

            const termination =  TerminationApi.getTermination(board, legalMoves, enemyMoves);
            expect(termination).toBe(Terminations.Mate);
        });

        test(`returns stalemate if expected`,  function() {
            const board =  fromFEN("7k/8/8/8/8/1q6/7q/K7 w - - 0 1");
            const legalMoves =  MoveGenerator.generateLegalMoves(board, Colours.white);
            const enemyMoves =  MoveGenerator.generateLegalMoves(board, Colours.black);

            const termination =  TerminationApi.getTermination(board, legalMoves, enemyMoves);
            expect(termination).toBe(Terminations.Stalemate);
        });

        test(`returns null if expected`,  function() {
            const board =  fromFEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
            const legalMoves =  MoveGenerator.generateLegalMoves(board, Colours.white);
            const enemyMoves =  MoveGenerator.generateLegalMoves(board, Colours.black);

            const termination =  TerminationApi.getTermination(board, legalMoves, enemyMoves);
            expect(termination).toBe(null);
        });

        test(`returns insufficient material if expected`,  function() {
            const board =  fromFEN("k5K1/8/8/8/8/8/8/8 w KQkq - 0 1");
            const legalMoves =  MoveGenerator.generateLegalMoves(board, Colours.white);
            const enemyMoves =  MoveGenerator.generateLegalMoves(board, Colours.black);

            const termination =  TerminationApi.getTermination(board, legalMoves, enemyMoves);
            expect(termination).toBe(Terminations.InsufficientMaterial);
        });

        test(`returns insufficient material if two same-square bishops`,  function() {
            const board =  fromFEN("k7/8/8/8/8/3B4/8/K2B4 w - - 0 1");
            const legalMoves =  MoveGenerator.generateLegalMoves(board, Colours.white);
            const enemyMoves =  MoveGenerator.generateLegalMoves(board, Colours.black);

            const termination =  TerminationApi.getTermination(board, legalMoves, enemyMoves);
            expect(termination).toBe(Terminations.InsufficientMaterial);
        });

        test(`returns null if two different square bishops`,  function() {
            const board =  fromFEN("k7/8/8/8/8/8/3B4/K2B4 w - - 0 1");
            const legalMoves =  MoveGenerator.generateLegalMoves(board, Colours.white);
            const enemyMoves =  MoveGenerator.generateLegalMoves(board, Colours.black);

            const termination =  TerminationApi.getTermination(board, legalMoves, enemyMoves);
            expect(termination).toBe(null);
        });

        test(`returns fifty move termination if expected`,  function() {
            const board =  fromFEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 51 1");
            const legalMoves =  MoveGenerator.generateLegalMoves(board, Colours.white);
            const enemyMoves =  MoveGenerator.generateLegalMoves(board, Colours.black);

            const termination =  TerminationApi.getTermination(board, legalMoves, enemyMoves);
            expect(termination).toBe(Terminations.FiftyMoveRule);
        });
    });
});