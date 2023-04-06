import boardPosition from "../src/boardPosition";
import Pieces from "../src/pieces";

describe("boardPosition -> createNew", function () {
   test("does not throw", function () {
       boardPosition.createEmpty();
   });

   test("returns 64 field array", function () {
       expect(boardPosition.createEmpty().length).toBe(64);
   });

    test(`returns only Pieces.Empty values`, function () {
        expect(boardPosition.createEmpty().every(x => x == Pieces.Empty)).toBe(true);
    });
});