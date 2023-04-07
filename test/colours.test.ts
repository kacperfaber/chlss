import {Colours} from "../src/colour";

describe('colours.ts', function () {
    describe('inverseColour', function () {
        test(`does not throw`, function() {
            Colours.inverseColour(Colours.white);
            Colours.inverseColour(Colours.black);
        });

        test(`returns colour=black when given is colour=white`, function () {
            expect(Colours.inverseColour(Colours.white)).toBe(Colours.black);
        });

        test(`returns colour=white when given is colour=black`, function () {
            expect(Colours.inverseColour(Colours.black)).toBe(Colours.white);
        });
    });
});