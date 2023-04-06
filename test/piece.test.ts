import Pieces from "../src/pieces";
import {Piece} from "../src/piece";
import {Colours} from "../src/colour";

describe("piece.ts", function () {
    describe('getColour', function () {
        test("does not throw", async function () {
            await Piece.getColour(Pieces.WhiteKnight);
        });

        test("returns null if given is Pieces.Empty", async function () {
           expect(await Piece.getColour(Pieces.Empty)).toBe(null);
        });

        Piece.allBlack.forEach(function (piece: Piece) {
            test(`returns Black if piece is '${piece}'`, async function () {
                expect(await Piece.getColour(piece)).toBe(Colours.Black);
            });
        });

        Piece.allWhite.forEach(function (piece: Piece) {
            test(`returns White if piece is '${piece}'`, async function () {
                expect(await Piece.getColour(piece)).toBe(Colours.White);
            });
        });
    });


    describe("isWhite", function () {
       test("does not throw", async function() {
            await Piece.isWhite(Pieces.WhiteBishop);
       });

       Piece.allWhite.forEach(function (piece: Piece) {
           test(`returns true if piece is '${piece}'`, async function() {
               expect(await Piece.isWhite(piece)).toBe(true);
           })
       });

        Piece.allBlack.forEach(function (piece: Piece) {
            test(`returns false if piece is '${piece}'`, async function() {
                expect(await Piece.isWhite(piece)).toBe(false);
            })
        });
    });

    describe("isBlack", function () {
        test("does not throw", async function() {
            await Piece.isBlack(Pieces.WhiteBishop);
        });

        Piece.allWhite.forEach(function (piece: Piece) {
            test(`returns false if piece is '${piece}'`, async function() {
                expect(await Piece.isBlack(piece)).toBe(false);
            })
        });

        Piece.allBlack.forEach(function (piece: Piece) {
            test(`returns true if piece is '${piece}'`, async function() {
                expect(await Piece.isBlack(piece)).toBe(true);
            })
        });
    });
});