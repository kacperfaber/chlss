import {IMove} from "../src/move";
import {SquareIndex} from "../src/square";
import Pieces from "../src/pieces";
import {BoardPosition} from "../src/boardPosition";

describe('boardPosition.ts', function () {
    describe('makeMoveAsync', function () {
        test(`does not throw`, async function () {
            const move: IMove = {
                from: 0 as SquareIndex,
                to: 8 as SquareIndex,
                piece: Pieces.WhiteKing,
                targetPiece: Pieces.Empty
            };

            const board = await BoardPosition.createEmpty();
            board[0] = Pieces.WhiteKing;

            await BoardPosition.makeMoveAsync(board, move);
        });

        test(`makes piece moved`, async function() {
            const move: IMove = {
                from: 0 as SquareIndex,
                to: 8 as SquareIndex,
                piece: Pieces.WhiteKing,
                targetPiece: Pieces.Empty
            };

            const board = await BoardPosition.createEmpty();
            board[0] = Pieces.WhiteKing;

            await BoardPosition.makeMoveAsync(board, move);

            expect(board[8]).toBe(Pieces.WhiteKing);
        });

        test(`makes initial square empty`, async function() {
            const move: IMove = {
                from: 0 as SquareIndex,
                to: 8 as SquareIndex,
                piece: Pieces.WhiteKing,
                targetPiece: Pieces.Empty
            };

            const board = await BoardPosition.createEmpty();
            board[0] = Pieces.WhiteKing;

            await BoardPosition.makeMoveAsync(board, move);

            expect(board[0]).toBe(Pieces.Empty);
        });
    });
});