import {Figure, IMove} from "./move";
import {BoardPosition} from "./boardPosition";
import {MoveMaker} from "./moveMaker";
import {sq, SquareIndex} from "./square";
import {BoardNotation} from "./boardNotation";
import {Piece} from "./piece";

export class UCI {
    static regex = /^([abcdefgh][1-8])([abcdefgh][1-8])([qrbn]?)$/;

    static  write(move: IMove, boardPose: BoardPosition) {
        if ( MoveMaker.isCastlingMove(move)) {
            return this.writeCastle(move);
        }

        function getPromotionCodeOrEmpty(figure: Figure | undefined) {
            if (figure == undefined) {
                return ""
            }

            else if (figure == "bishop") {
                return "b";
            }

            else if (figure == "queen") {
                return "q";
            }

            else if (figure == "rook") {
                return "r";
            }

            else if (figure == "knight") {
                return "n";
            }

            throw new Error("");
        }

        const fromN = BoardNotation.toBoardNotation(move.from);
        const toN = BoardNotation.toBoardNotation(move.to);
        return `${fromN}${toN}${getPromotionCodeOrEmpty(move.promotion)}`
    }

    static  parse(move: string, legalMoves: IMove[], boardPosition: BoardPosition): IMove | never {
        const result = UCI.regex.exec(move);

        if (result == null) {
            throw new Error("");
        }

        const fromNotation = result[1];
        const toNotation = result[2];
        const promotionString = result[3];

        function promotionToFigureOrUndefined(promotion: string): Figure | undefined {
            if (promotion == "") {
                return undefined;
            }

            else if (promotion == "q") return "queen";

            else if (promotion == "r") return "rook";

            else if (promotion == "b") return "bishop";

            else if (promotion == "n") return "knight";

            throw new Error("");
        }

        const from = BoardNotation.fromBoardNotation(fromNotation);
        const to = BoardNotation.fromBoardNotation(toNotation);
        const figure = promotionToFigureOrUndefined(promotionString);

        if ( this.isCastlingMoveUCI(fromNotation, toNotation, boardPosition)) {

            function validateTo(to: SquareIndex) {
                return (toNotation == "g1" && to == 63) || (toNotation == "c1" && to == 56)
                    || (toNotation == "g8" && to == 7) || (toNotation == "c8" && to == 0)
            }

            return legalMoves.find(x => Piece.isKing(x.piece) && x.from == from && validateTo(x.to))!!;
        }

        let pickedMove = legalMoves.find(x => x.from == from && x.to == to)!!;
        pickedMove.promotion = figure;
        return pickedMove;
    }

    private static  isCastlingMoveUCI(from: string, to: string, boardPosition: BoardPosition): boolean {
        const piece =  BoardPosition.getPiece(boardPosition, BoardNotation.fromBoardNotation(from));
        return Piece.isKing(piece) && (
            (from == "e8" && to == "c8") ||
            (from == "e1" && to == "c1") ||
            (from == "e8" && to == "g8") ||
            (from == "e1" && to == "g1")
        )
    }

    private static writeCastle(move: IMove): string | never {
        if (move.from == sq(4)) {
            if (move.to == sq(0)) {
                return "e8c8";
            } else if (move.to == sq(7)) {
                return "e8g8"
            }
        } else if (move.from == sq(60)) {
            if (move.to == sq(56)) {
                return "e1c1";
            } else if (move.to == sq(63)) {
                return "e1g1";
            }
        }

        throw new Error("UCI -> Bad castle move to write.");
    }
}