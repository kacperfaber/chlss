import {IMove} from "./move";
import {BoardPosition} from "./boardPosition";
import {MoveMaker} from "./moveMaker";
import {sq, SquareIndex} from "./square";
import {BoardNotation} from "./boardNotation";

export class UCI {
    static async write(move: IMove, boardPose: BoardPosition) {
        if (await MoveMaker.isCastlingMove(move)) {
            return this.writeCastle(move);
        }

        // TODO what with en passant?

        // TODO PROMOTION not implemented

        return BoardNotation.toBoardNotation(move.from) + BoardNotation.toBoardNotation(move.to);
    }

    private static writeCastle(move: IMove): string | never {
        if (move.from == sq(4)) {
            if (move.to == sq(0)) {
                return "e8c8";
            }

            else if (move.to == sq(7)) {
                return "e8g8"
            }
        }

        else if (move.from == sq(60)) {
            if (move.to == sq(56)) {
                return "e1c1";
            }

            else if (move.to == sq(63)) {
                return "e1g1";
            }
        }

        throw new Error("UCI -> Bad castle move to write.");
    }
}