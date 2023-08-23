import {FEN} from "./fen";
import {Board} from "./board";
import {IMove} from "./move";
import {MoveGenerator} from "./moveGenerator";
import {MoveMaker} from "./moveMaker";
import {BoardPosition} from "./boardPosition";
import {UCI} from "./uci";
import {Termination, TerminationApi} from "./termination";
import {Colour, Colours} from "./colour";

export class BoardObj {
    private board = Board.createEmpty();

    constructor(fen: string | undefined = undefined) {
        if (fen) {
            this.fen(fen);
        }
    }

    fen(setFen: string | undefined = undefined): string {
        if (!setFen) return FEN.writeFEN(this.board);
        FEN.loadFEN(setFen, this.board);
        return setFen;
    }

    pose(): BoardPosition {
        return this.board.position;
    }

    pushUci(uci: string): void {
        const legalMoves = this.legalMoves();
        const move = UCI.parse(uci, legalMoves, this.board.position);
        this.push(move);
    }

    legalMoves(): Array<IMove> {
        return MoveGenerator.generateLegalMoves(this.board, this.board.toMove);
    }

    legalMovesUci(): Array<string> {
        const moves = this.legalMoves()
        const r: Array<string> = [];

        for (const move of moves) {
            if (move.isPromo) {
                move.promotion = "knight";
                r.push(UCI.write(move));

                move.promotion = "rook";
                r.push(UCI.write(move));

                move.promotion = "queen";
                r.push(UCI.write(move));

                move.promotion = "bishop";
                r.push(UCI.write(move));

                move.promotion = undefined;
            }

            else {
                const uci = UCI.write(move);
                r.push(uci);
            }
        }

        return r;
    }

    push(move: IMove): void {
        return MoveMaker.makeMove(this.board, move);
    }

    private getEnemyMoves(): Array<IMove> {
        return MoveGenerator.generateLegalMoves(this.board, Colours.inverseColour(this.board.toMove));
    }

    getTermination(): Termination | null {
        const legalMoves = this.legalMoves();
        return TerminationApi.getTermination(this.board, legalMoves, this.getEnemyMoves())
    }

    getColour(): Colour {
        return this.board.toMove;
    }
}