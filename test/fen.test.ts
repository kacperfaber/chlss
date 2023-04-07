import {Board, IBoard} from "../src/board";
import {BoardPosition} from "../src/boardPosition";
import {Colours} from "../src/colour";
import {FEN} from "../src/fen";
import {SquareIndex} from "../src/square";
import Pieces from "../src/pieces";


// TODO: FEN it's very important and complicated system and it needs to be tested good.

describe('fen.ts', function () {
    describe('applyFEN', function () {
        test(`does not throw`, async function () {
            const board = Board.createEmpty();
            await FEN.applyFEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", board);
        });
    });

    describe('writeFEN', function () {
        test(`does not throw `, async function () {
            const board: IBoard ={
                position: await BoardPosition.createDefault(),
                fullMoveCounter: 0,
                halfMoveNumber: 0,
                enPassant: "e4",
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

            await FEN.writeFEN(board);
        });

        test(`expected FEN - test 2`, async function () {
            const pose = await BoardPosition.createEmpty();
            await BoardPosition.setPiece(pose, 63 as SquareIndex, Pieces.WhiteQueen)
            await BoardPosition.setPiece(pose, 0 as SquareIndex, Pieces.WhiteQueen)

            const board: IBoard ={
                position: pose,
                fullMoveCounter: 0,
                halfMoveNumber: 0,
                enPassant: "e4",
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

            expect(await FEN.writeFEN(board)).toBe("Q7/8/8/8/8/8/8/7Q w KQkq e4 0 0");
        });
    });
});