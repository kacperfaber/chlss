import {BoardPosition} from "../src/boardPosition";
import {SquareIndex} from "../src/square";

describe('boardPosition.ts', function () {
    describe('copyAsync', function () {
        test(`does not throw`, async function() {
            const board = await BoardPosition.createEmpty();
            const copy = await BoardPosition.copyAsync(board);
        });

        test(`returns expected data`, async function() {
            const board = await BoardPosition.createEmpty();
            const copy = await BoardPosition.copyAsync(board);

            for (let i = 0; i < 64; i++) {
                let index = i as SquareIndex;
                expect(await BoardPosition.getPiece(board, index)).toBe(await BoardPosition.getPiece(copy, index));
            }
        });

        test(`returns expected data - not empty board`, async function() {
            const board = await BoardPosition.createDefault();
            const copy = await BoardPosition.copyAsync(board);

            for (let i = 0; i < 64; i++) {
                let index = i as SquareIndex;
                expect(await BoardPosition.getPiece(board, index)).toBe(await BoardPosition.getPiece(copy, index));
            }
        });

        test(`returns not a original board`, async function() {
            const board = await BoardPosition.createEmpty();
            const copy = await BoardPosition.copyAsync(board);
            expect(copy).not.toBe(board);
        });
    });
});