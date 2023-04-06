import {Coords} from "../src/coords";
import {SquareIndex} from "../src/square";
import {RangeUtils} from "./utils/rangeUtils";


describe("coords.ts", function () {
    describe("toX", function () {

        test("does not throw for range 0-63", function () {
            RangeUtils.forRangeGeneric<SquareIndex>(0, 63, function (squareIndex: SquareIndex) {
                Coords.toX(squareIndex);
            });
        });

        test("returns 0 when squareIndex=0", function () {
            expect(Coords.toX(0)).toBe(0);
        });

        test("returns 7 when squareIndex=7", function () {
            expect(Coords.toX(63)).toBe(7);
        });
    });

    describe("toY", function () {

        test("does not throw for range 0-63", function () {
            RangeUtils.forRangeGeneric<SquareIndex>(0, 63, function (squareIndex: SquareIndex) {
                Coords.toY(squareIndex);
            });
        });

        test("returns 0 when squareIndex=0", function () {
            expect(Coords.toY(0)).toBe(0);
        });

        test("returns 7 when squareIndex=7", function () {
            expect(Coords.toY(63)).toBe(7);
        });
    });

    describe("toSquareIndex", function () {
        test("returns 0 when (0, 0)", function () {
            expect(Coords.toSquareIndex(0, 0)).toBe(0);
        });

        test("returns 7 when (7, 0)", function () {
            expect(Coords.toSquareIndex(7, 0)).toBe(7);
        });

        test("returns 63 when (7, 7)", function () {
            expect(Coords.toSquareIndex(7, 7)).toBe(63);
        });

        test("returns 15 when (1, 3)", function () {
            expect(Coords.toSquareIndex(1, 3)).toBe(25);
        })
    });
});