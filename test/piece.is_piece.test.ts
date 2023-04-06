import {Piece} from "../src/piece";
import piecesUtils from "./utils/piecesUtils";
import Pieces from "../src/pieces";

describe('piece.ts - Is (piece) tests', function () {
    type IsPieceTest = {name: string, trueFor: Array<Piece>, method: (piece: Piece) => boolean};

    function describeIsPieceTest(data: Array<IsPieceTest>) {
        data.forEach(function (item) {
            describe(item.name, function () {
                piecesUtils.piecesWithout(item.trueFor).forEach(function (piece: Piece) {
                    test(`returns false if piece is '${piece}'`, function () {
                        expect(item.method(piece)).toBe(false);
                    });
                });

                item.trueFor.forEach(function (truePiece: Piece) {
                    test(`returns true if piece is ${truePiece}`, function () {
                        expect(item.method(truePiece)).toBe(true);
                    });
                });
            });
        });
    }

    const IsPieceTestData = [
        {
            name: "isQueen",
            method: (piece: Piece) => Piece.isQueen(piece),
            trueFor: [Pieces.WhiteQueen, Pieces.BlackQueen],
        },
        {
            name: "isPawn",
            method: (piece: Piece) => Piece.isPawn(piece),
            trueFor: [Pieces.WhitePawn, Pieces.BlackPawn],
        },
        {
            name: "isKing",
            method: (piece: Piece) => Piece.isKing(piece),
            trueFor: [Pieces.WhiteKing, Pieces.BlackKing],
        },
        {
            name: "isRook",
            method: (piece: Piece) => Piece.isRook(piece),
            trueFor: [Pieces.WhiteRook, Pieces.BlackRook],
        },
        {
            name: "isBishop",
            method: (piece: Piece) => Piece.isBishop(piece),
            trueFor: [Pieces.WhiteBishop, Pieces.BlackBishop],
        },
        {
            name: "isKnight",
            method: (piece: Piece) => Piece.isKnight(piece),
            trueFor: [Pieces.WhiteKnight, Pieces.BlackKnight],
        },
    ];

    describeIsPieceTest(IsPieceTestData);
});