import {LineMoveGenerator} from "../src/lineMoveGenerator";
import {BoardPosition} from "../src/boardPosition";
import Pieces from "../src/pieces";
import {Colours} from "../src/colour";
import {IMove} from "../src/move";

describe('lineMoveGenerator.ts', function () {

    describe('generateMoves',  function () {


        test(`does not throw`, async function() {
            const moveList: Array<IMove> = [];
            const boardPosition = await BoardPosition.createEmpty();
            await LineMoveGenerator.generateMoves(boardPosition, Pieces.WhiteBishop, 0, 0, 0, 1, 0, Colours.white, moveList);
        });

        test(`makes moveList greater after call`, async function() {
            const moveList: Array<IMove> = [];
            await LineMoveGenerator.generateMoves(await BoardPosition.createEmpty(), Pieces.WhiteBishop, 0, 0, 0, 1, 0, Colours.white, moveList);
            expect(moveList.length).toBeGreaterThan(0);
        });
    });

    describe('generateUsingOffsets', function () {
        test(`does not throw`, async function () {
            const pose = await BoardPosition.createEmpty();
            await LineMoveGenerator.generateUsingOffsets(pose, Pieces.BlackBishop, Colours.black, 0, 0, 0, [{
                x: 1,
                y: 0
            }], []);
        });

        test("call makes moveList greater than 0", async function () {
            const pose = await BoardPosition.createEmpty();
            const moveList: Array<IMove> = [];
            await LineMoveGenerator.generateUsingOffsets(pose, Pieces.BlackBishop, Colours.black, 0, 0, 0, [{
                x: 1,
                y: 0
            }], moveList);

            expect(moveList.length).toBeGreaterThan(0);
        });

        test(`call makes moveList expected length - scenario 1`, async function() {
            const pose = await BoardPosition.createEmpty();
            const moveList: Array<IMove> = [];
            await LineMoveGenerator.generateUsingOffsets(pose, Pieces.BlackBishop, Colours.black, 0, 0, 0, [{
                x: 1,
                y: 0
            }], moveList);

            expect(moveList.length).toBe(7);
        });

        test(`call makes moveList expected length - scenario 2`, async function() {
            const pose = await BoardPosition.createEmpty();
            const moveList: Array<IMove> = [];
            await LineMoveGenerator.generateUsingOffsets(pose, Pieces.BlackBishop, Colours.black, 0, 0, 0, [{
                x: 0,
                y: 1
            }], moveList);

            expect(moveList.length).toBe(7);
        });

        test(`call makes moveList expected length - scenario 2`, async function() {
            const pose = await BoardPosition.createEmpty();
            const moveList: Array<IMove> = [];
            await LineMoveGenerator.generateUsingOffsets(pose, Pieces.BlackBishop, Colours.black, 0, 3, 0, [{
                x: 1,
                y: 0
            }], moveList);

            expect(moveList.length).toBe(4);
        });
    });
});