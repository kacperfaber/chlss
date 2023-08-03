import {BoardPosition} from "../src/boardPosition";
import Pieces from "../src/pieces";

describe("BoardPosition", function () {
    describe('createEmpty', function () {
        test("does not throw",  function () {
             BoardPosition.createEmpty();
        });

        test("returns 64 field array",  function () {
            expect(( BoardPosition.createEmpty()).length).toBe(64);
        });

        test(`returns only Pieces.Empty values`,  function () {
            expect(( BoardPosition.createEmpty()).every(x => x == Pieces.Empty)).toBe(true);
        });
    });
});