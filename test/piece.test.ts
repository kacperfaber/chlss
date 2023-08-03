import Pieces from "../src/pieces";
import {Piece} from "../src/piece";
import {Colours} from "../src/colour";

describe("piece.ts", function () {
    describe('getColour', function () {
        test("does not throw",  function () {
             Piece.getColour(Pieces.WhiteKnight);
        });

        test("returns null if given is Pieces.Empty",  function () {
           expect( Piece.getColour(Pieces.Empty)).toBe(null);
        });

        Piece.allBlack.forEach(function (piece: Piece) {
            test(`returns Black if piece is '${piece}'`,  function () {
                expect( Piece.getColour(piece)).toBe(Colours.black);
            });
        });

        Piece.allWhite.forEach(function (piece: Piece) {
            test(`returns White if piece is '${piece}'`,  function () {
                expect( Piece.getColour(piece)).toBe(Colours.white);
            });
        });
    });


    describe("isWhite", function () {
       test("does not throw",  function() {
             Piece.isWhite(Pieces.WhiteBishop);
       });

       Piece.allWhite.forEach(function (piece: Piece) {
           test(`returns true if piece is '${piece}'`,  function() {
               expect( Piece.isWhite(piece)).toBe(true);
           })
       });

        Piece.allBlack.forEach(function (piece: Piece) {
            test(`returns false if piece is '${piece}'`,  function() {
                expect( Piece.isWhite(piece)).toBe(false);
            })
        });
    });

    describe("isBlack", function () {
        test("does not throw",  function() {
             Piece.isBlack(Pieces.WhiteBishop);
        });

        Piece.allWhite.forEach(function (piece: Piece) {
            test(`returns false if piece is '${piece}'`,  function() {
                expect( Piece.isBlack(piece)).toBe(false);
            })
        });

        Piece.allBlack.forEach(function (piece: Piece) {
            test(`returns true if piece is '${piece}'`,  function() {
                expect( Piece.isBlack(piece)).toBe(true);
            })
        });
    });
});