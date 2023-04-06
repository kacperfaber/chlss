import {BoardPosition} from "../src/boardPosition";
import Pieces from "../src/pieces";

describe("BoardPosition -> createNew", function () {
   test("does not throw", async function () {
       await BoardPosition.createEmpty();
   });

   test("returns 64 field array", async function () {
       expect((await BoardPosition.createEmpty()).length).toBe(64);
   });

    test(`returns only Pieces.Empty values`, async function () {
        expect((await BoardPosition.createEmpty()).every(x => x == Pieces.Empty)).toBe(true);
    });
});