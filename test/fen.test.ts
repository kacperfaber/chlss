import {Board, IBoard} from "../src/board";
import {BoardPosition} from "../src/boardPosition";
import {Colours} from "../src/colour";
import {FEN} from "../src/fen";
import {SquareIndex} from "../src/square";
import Pieces from "../src/pieces";


// TODO: FEN it's very important and complicated system and it needs to be tested good.

describe('fen.ts', function () {
    describe('loadFEN', function () {
        test(`does not throw`,  function () {
            const board = Board.createEmpty();
             FEN.loadFEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", board);
        });
    });

    describe('writeFEN', function () {
        test(`does not throw `,  function () {
            const board: IBoard ={
                position:  BoardPosition.createDefault(),
                fullMoveCounter: 0,
                halfMoveNumber: 0,
                enPassant: null,
                toMove: Colours.white,
                castling: {
                    black: {
                        queenSide: true,
                        kingSide: true,
                    },
                    white: {
                        queenSide: true,
                        kingSide: true
                    }
                }
            }

             FEN.writeFEN(board);
        });

        test(`expected FEN - test 2`,  function () {
            const pose =  BoardPosition.createEmpty();
             BoardPosition.setPiece(pose, 63 as SquareIndex, Pieces.WhiteQueen)
             BoardPosition.setPiece(pose, 0 as SquareIndex, Pieces.WhiteQueen)

            const board: IBoard ={
                position: pose,
                fullMoveCounter: 0,
                halfMoveNumber: 0,
                enPassant: null,
                toMove: Colours.white,
                castling: {
                    black: {
                        queenSide: true,
                        kingSide: true,
                    },
                    white: {
                        queenSide: true,
                        kingSide: true
                    }
                }
            }

            expect( FEN.writeFEN(board)).toBe("Q7/8/8/8/8/8/8/7Q w KQkq - 0 0");
        });
    });
});