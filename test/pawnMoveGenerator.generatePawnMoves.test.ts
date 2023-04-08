import {BoardPosition} from "../src/boardPosition";
import Pieces from "../src/pieces";
import {PawnMoveGenerator} from "../src/pawnMoveGenerator";
import {SquareIndex} from "../src/square";
import {Colours} from "../src/colour";
import {IMove} from "../src/move";

describe('pawnMoveGenerator.ts', function () {
    describe('generatePawnMoves', function () {
        test(`does not throw`, async function() {
            const board = await BoardPosition.createEmpty();
            board[48] = Pieces.WhitePawn;

            await PawnMoveGenerator.generatePawnMoves(board, Pieces.WhitePawn, 48 as SquareIndex, 0, 6, Colours.white, []);
        });

        test(`returns 2 move length when pawn can move ahead`, async function() {
            const board = await BoardPosition.createEmpty();
            board[48] = Pieces.WhitePawn;
            const moveList: Array<IMove> = [];
            await PawnMoveGenerator.generatePawnMoves(board, Pieces.WhitePawn, 48 as SquareIndex, 0, 6, Colours.white, moveList);
            expect(moveList.length).toBe(2);
        });

        test(`returns 1 move length when pawn can move ahead twice`, async function() {
            const board = await BoardPosition.createEmpty();
            board[40] = Pieces.WhitePawn;
            const moveList: Array<IMove> = [];
            await PawnMoveGenerator.generatePawnMoves(board, Pieces.WhitePawn, 40 as SquareIndex, 0, 5, Colours.white, moveList);
            expect(moveList.length).toBe(1);
        });

        test(`returns 0 move length when pawn is blocked`, async function() {
            const board = await BoardPosition.createEmpty();
            board[40] = Pieces.WhitePawn;
            board[32] = Pieces.BlackQueen;
            const moveList: Array<IMove> = [];
            await PawnMoveGenerator.generatePawnMoves(board, Pieces.WhitePawn, 40 as SquareIndex, 0, 5, Colours.white, moveList);
            expect(moveList.length).toBe(0);
        });

        test(`returns 3 move length if pawn can move twice and kill`, async function() {
            const board = await BoardPosition.createEmpty();
            board[48] = Pieces.WhitePawn;
            board[49-8] = Pieces.BlackPawn;
            const moveList: Array<IMove> = [];
            await PawnMoveGenerator.generatePawnMoves(board, Pieces.WhitePawn, 48 as SquareIndex, 0, 6, Colours.white, moveList);
            expect(moveList.length).toBe(3);
        });

        test(`returns 4 move length if pawn can move twice and kill two times`, async function() {
            const board = await BoardPosition.createEmpty();
            board[49] = Pieces.WhitePawn;
            board[50-8] = Pieces.BlackPawn;
            board[48-8] = Pieces.BlackPawn;
            const moveList: Array<IMove> = [];
            await PawnMoveGenerator.generatePawnMoves(board, Pieces.WhitePawn, 48 as SquareIndex, 1, 6, Colours.white, moveList);
            expect(moveList.length).toBe(4);
        });
    });
});