import {PawnMoveGenerator} from "../src/pawnMoveGenerator";
import {Colours} from "../src/colour";

describe('pawnMoveGenerator.ts', function () {
    describe('getYDir', function () {
        test(`does not throw`, function () {
            PawnMoveGenerator.getYDir(Colours.white);
        });

        test(`returns negative -1 if COLOUR=white`, () => {
            expect(PawnMoveGenerator.getYDir(Colours.white)).toBe(-1);
        });

        test(`returns negative 1 if COLOUR=black`, () => {
            expect(PawnMoveGenerator.getYDir(Colours.black)).toBe(1);
        });
    });
});