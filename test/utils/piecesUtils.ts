import {Piece} from "../../src/piece";

export default {
    piecesWithout(exclude: Array<Piece>): Array<Piece> {
        const arr: Array<Piece> = [];
        arr.push(...Piece.allWhite, ...Piece.allBlack);
        return arr.filter(function (piece: Piece) {
            return !exclude.includes(piece);
        });
    }
}