import {RookMoveGenerator} from "../src/rookMoveGenerator";
import {IMove} from "../src/move";
import {boardOf} from "./utils/boardUtils";
import Pieces from "../src/pieces";
import {Colours} from "../src/colour";
import {SquareIndex} from "../src/square";
import {Piece} from "../src/piece";

describe('rookMoveGenerator', function () {
    describe('generateRookMoves', function () {
        test(`does not throw`,  function () {
            const moveList: Array<IMove> = [];
             RookMoveGenerator.generateRookMoves( boardOf({
                x: 0,
                y: 0,
                piece: Pieces.WhiteRook
            }), Pieces.WhiteRook, Colours.white, 0, 0, 0, moveList);
        });

        test(`returns expected move length - from position to border - scenario 1`,  function () {
            const moveList: Array<IMove> = [];
             RookMoveGenerator.generateRookMoves( boardOf({
                x: 0,
                y: 0,
                piece: Pieces.WhiteRook
            }), Pieces.WhiteRook, Colours.white, 0, 0, 0, moveList);
            expect(moveList.length).toBe(14);
        });

        test(`returns expected move length - from position to friendly piece - scenario 2`,  function () {
            const board =  boardOf(
                {x: 0, y: 0, piece: Pieces.WhiteRook},
                {x: 1, y: 0, piece: Pieces.WhiteRook},
                {x: 0, y: 1, piece: Pieces.WhiteRook}
            );

            const moveList: Array<IMove> = [];

             RookMoveGenerator.generateRookMoves(board,
                Pieces.WhiteRook, Colours.white, 0, 0, 0, moveList);

            expect(moveList.length).toBe(0);
        });

        test(`returns expected move length - from position to friendly piece - scenario 1`,  function () {
            const board =  boardOf(
                {x: 0, y: 0, piece: Pieces.WhiteRook},
                {x: 2, y: 0, piece: Pieces.WhiteRook},
                {x: 0, y: 2, piece: Pieces.WhiteRook},
            );

            const moveList: Array<IMove> = [];

             RookMoveGenerator.generateRookMoves(board,
                Pieces.WhiteRook, Colours.white, 0, 0, 0, moveList);

            expect(moveList.length).toBe(2);
        });

        test(`returns expected move length - from position to friendly piece - scenario 3`,  function () {
            const board =  boardOf(
                {x: 2, y: 2, piece: Pieces.WhiteRook},
                {x: 4, y: 2, piece: Pieces.WhiteRook},
                {x: 2, y: 4, piece: Pieces.WhiteRook},
            );

            const moveList: Array<IMove> = [];

             RookMoveGenerator.generateRookMoves(board,
                Pieces.WhiteRook, Colours.white, 18 as SquareIndex, 2, 2, moveList);

            expect(moveList.length).toBe(6);
        });

        test(`returns expected move length - from position to border - scenario 2`,  function () {
            const moveList: Array<IMove> = [];
             RookMoveGenerator.generateRookMoves( boardOf({
                x: 3,
                y: 3,
                piece: Pieces.WhiteRook
            }), Pieces.WhiteRook, Colours.white, 27, 3, 3, moveList);
            expect(moveList.length).toBe(14);
        });

        test(`returns expected move length - from position to enemy - scenario 1`,  function () {
            const moveList: Array<IMove> = [];
            const boardPosition =  boardOf(
                {x: 0, y: 0, piece: Pieces.WhiteRook},
                {x: 1, y: 0, piece: Pieces.BlackQueen}
            );
             RookMoveGenerator.generateRookMoves(boardPosition, Pieces.WhiteRook, Colours.white, 0, 0, 0, moveList);
            expect(moveList.length).toBe(8);
        });

        test(`returns expected move length - from position to enemy - scenario 2`,  function () {
            const moveList: Array<IMove> = [];
            const boardPosition =  boardOf(
                {x: 0, y: 0, piece: Pieces.WhiteRook},
                {x: 1, y: 0, piece: Pieces.BlackQueen},
                {x: 0, y: 1, piece: Pieces.BlackQueen}
            );
             RookMoveGenerator.generateRookMoves(boardPosition, Pieces.WhiteRook, Colours.white, 0, 0, 0, moveList);
            expect(moveList.length).toBe(2);
        });

        test(`returns expected move length - from position to enemy - scenario 3`,  function () {
            const moveList: Array<IMove> = [];
            const boardPosition =  boardOf(
                {x: 1, y: 1, piece: Pieces.WhiteRook},
                {x: 1, y: 0, piece: Pieces.BlackQueen},
                {x: 0, y: 1, piece: Pieces.BlackQueen},
                {x: 2, y: 1, piece: Pieces.BlackQueen},
                {x: 1, y: 2, piece: Pieces.BlackQueen}
            );
             RookMoveGenerator.generateRookMoves(boardPosition, Pieces.WhiteRook, Colours.white, 9, 1, 1, moveList);
            expect(moveList.length).toBe(4);
        });

        test(`returns expected move with targetPiece - scenario 1`,  function () {
            const moveList: Array<IMove> = [];
            const boardPosition =  boardOf(
                {x: 1, y: 1, piece: Pieces.WhiteRook},
                {x: 1, y: 2, piece: Pieces.BlackQueen}
            );
             RookMoveGenerator.generateRookMoves(boardPosition, Pieces.WhiteRook, Colours.white, 9, 1, 1, moveList);
            const has = moveList.some((m) => m.targetPiece == Pieces.BlackQueen);
            expect(has).toBe(true);
        });

        test(`returns expected move with targetPiece - scenario 2`,  function () {
            const moveList: Array<IMove> = [];
            const boardPosition =  boardOf(
                {x: 1, y: 1, piece: Pieces.WhiteRook},
                {x: 2, y: 1, piece: Pieces.BlackQueen}
            );
             RookMoveGenerator.generateRookMoves(boardPosition, Pieces.WhiteRook, Colours.white, 9, 1, 1, moveList);
            const has = moveList.some((m) => m.targetPiece == Pieces.BlackQueen);
            expect(has).toBe(true);
        });

        test(`returns expected move with targetPiece - scenario 3`,  function () {
            const moveList: Array<IMove> = [];
            const boardPosition =  boardOf(
                {x: 1, y: 1, piece: Pieces.WhiteRook},
                {x: 5, y: 1, piece: Pieces.BlackQueen}
            );
             RookMoveGenerator.generateRookMoves(boardPosition, Pieces.WhiteRook, Colours.white, 9, 1, 1, moveList);
            const has = moveList.some((m) => m.targetPiece == Pieces.BlackQueen);
            expect(has).toBe(true);
        });
    });
});