import {StringBuilder} from "../src/stringBuilder";

describe('stringBuilder.ts', function () {
    describe('append', function () {
        test(`does not throw`, function () {
           new StringBuilder().append("test");
        });

        test("appends text to data", function () {
           const stringBuilder = new StringBuilder();
           stringBuilder.append("test");
           expect(stringBuilder.data.length).toBe(1);
        });

        test("build method returns expected after append", function () {
            const stringBuilder = new StringBuilder();
            stringBuilder.append("test");
            expect(stringBuilder.build()).toBe("test");
        });
    });

    describe('`constructor`', function () {
        test(`does not throw when empty`, function () {
           new StringBuilder();
        });

        test(`does not throw when with single array element`, function () {
            new StringBuilder("test");
        });

        test(`does not throw when with more than one array element`, function () {
            new StringBuilder("test", "test", "test");
        });

        test(`build method returns expected what given in constructor`, function () {
            expect(new StringBuilder("Kacper", " ", "Faber").build()).toBe("Kacper Faber");
        });
    });

    describe('build', function () {
        test(`does not throw no data added`, function () {
            new StringBuilder().build();
        });

        test(`does not throw when data added`, function () {
            new StringBuilder("test", "test").build();
        });

        test(`returns expected`, function () {
            expect(new StringBuilder("test", "test").build()).toBe("testtest");
        });
    });
});