import {BoardNotation} from "../src/boardNotation";

const ThrowsData = [
    'h9',
    'a9',
    'a0',
    'z5'
];

const TestData = [
    {str: 'a8', e: 0}
]

describe('boardNotation.ts', function () {
    describe('fromBoardNotation', function () {
        test(`does not throw`, function () {
            BoardNotation.fromBoardNotation('a1');
        });

        ThrowsData.forEach((throwsData) => {
            test(`throws when: '${throwsData}'`, function () {
                expect(() => BoardNotation.fromBoardNotation(throwsData)).toThrow();
            });
        });

        TestData.forEach(({str, e}) => {
            test(`for '${str}' returns: ${e}`, function () {
                expect(BoardNotation.fromBoardNotation(str)).toBe(e);
            });
        });
    });
});