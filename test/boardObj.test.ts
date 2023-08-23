import {BoardObj} from "../src";

describe('boardObj.ts', function () {
    describe('boardObj', function () {
        describe('getColour', function () {
            test("does not throw", function() {
                const board = new BoardObj("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
                expect(() => board.getColour()).not.toThrow();
            });

            test("white if expected", function() {
                const board = new BoardObj("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
                expect(board.getColour()).toBe("white");
            });

            test("black if expected", function() {
                const board = new BoardObj("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1");
                expect(board.getColour()).toBe("black");
            });
        });
    });
});