import {BoardPosition} from "../src/boardPosition";
import {SquareIndex} from "../src/square";

describe('boardPosition.ts', function () {
    describe('copyAsync', function () {
        test(`does not throw`,  function() {
            const board =  BoardPosition.createEmpty();
            const copy =  BoardPosition.copyAsync(board);
        });

        test(`returns expected data`,  function() {
            const board =  BoardPosition.createEmpty();
            const copy =  BoardPosition.copyAsync(board);

            for (let i = 0; i < 64; i++) {
                let index = i as SquareIndex;
                expect( BoardPosition.getPiece(board, index)).toBe( BoardPosition.getPiece(copy, index));
            }
        });

        test(`returns expected data - not empty board`,  function() {
            const board =  BoardPosition.createDefault();
            const copy =  BoardPosition.copyAsync(board);

            for (let i = 0; i < 64; i++) {
                let index = i as SquareIndex;
                expect( BoardPosition.getPiece(board, index)).toBe( BoardPosition.getPiece(copy, index));
            }
        });

        test(`returns not a original board`,  function() {
            const board =  BoardPosition.createEmpty();
            const copy =  BoardPosition.copyAsync(board);
            expect(copy).not.toBe(board);
        });
    });
});