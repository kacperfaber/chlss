import {BoardNotation} from "../src/boardNotation";

const TestData = [
    {index: 0, expected: 'a8'},
    {index: 5, expected: 'f8'},
    {index: 7, expected: 'h8'},
    {index: 24, expected: 'a5'},
    {index: 27, expected: 'd5'},
];

describe('boardNotation.ts', function () {
    describe('toBoardNotation', function () {
        test(`does not throw`, function () {
            BoardNotation.toBoardNotation(50);
        });

        test(`expected data - index: 0 expected: a8`, function () {
            const actual = BoardNotation.toBoardNotation(0);
            expect(actual).toBe('a8');
        });

        test(`expected data - index: 0 expected: a8`, function () {
            const actual = BoardNotation.toBoardNotation(63);
            expect(actual).toBe('h1');
        });

        TestData.forEach(({index, expected}) => test(`for '${index}' returns: '${expected}'`));
    });
});