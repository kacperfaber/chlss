import {PawnMoveGenerator} from "../src/pawnMoveGenerator";
import {Colours} from "../src/colour";

describe('pawnMoveGenerator.ts', function () {
    describe('generatePawnMoves', function () {
        describe('getYDir', function () {
            test('does not throw', function () {
               PawnMoveGenerator.getYDir(Colours.white);
            });

            test(`returns positive 1 if colour is black`, function () {
                expect(PawnMoveGenerator.getYDir(Colours.black)).toBe(1);
            });

            test(`returns negative -1 if colour is white`, function () {
                expect(PawnMoveGenerator.getYDir(Colours.white)).toBe(-1);
            });
        });

        describe('validateYPositionToMoveTwoSquare', function () {
            test(`does not throw`, function () {
                PawnMoveGenerator.validateYPositionToMoveTwoSquare(1, Colours.white);
            });

            test(`returns false if posY=1 colour=white`, function () {
                expect(PawnMoveGenerator.validateYPositionToMoveTwoSquare(1, Colours.white))
                    .toBe(false);
            });

            test(`returns false if posY=6 colour=black`, function () {
                expect(PawnMoveGenerator.validateYPositionToMoveTwoSquare(6, Colours.black))
                    .toBe(false);
            });

            test(`returns true if posY=1 colour=black`, function () {
                expect(PawnMoveGenerator.validateYPositionToMoveTwoSquare(1, Colours.black))
                    .toBe(true);
            });

            test(`returns true if posY=6 colour=white`, function () {
                expect(PawnMoveGenerator.validateYPositionToMoveTwoSquare(6, Colours.white))
                    .toBe(true);
            });
        });
    });
});