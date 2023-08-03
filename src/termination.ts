import {IBoard} from "./board";
import {IMove} from "./move";
import {Colour, Colours} from "./colour";
import {Piece} from "./piece";
import {BoardPosition} from "./boardPosition";
import {SquareIndex} from "./square";

// TODO: Make it prettier...

export const Terminations = {
    // win / lose

    Mate: 0,
    Timeout: 1,
    Resignation: 2,

    // draws

    Stalemate: 3,
    InsufficientMaterial: 4,
    FiftyMoveRule: 5,
    Repetition: 6,
    Agreement: 7
};


export type Termination =
    typeof Terminations.Mate
    | typeof Terminations.Timeout
    | typeof Terminations.Resignation
    | typeof Terminations.Stalemate
    | typeof Terminations.InsufficientMaterial
    | typeof Terminations.FiftyMoveRule
    | typeof Terminations.Repetition
    | typeof Terminations.Agreement;

function isEmpty(arr: Array<IMove>): boolean {
    return arr.length == 0;
}

function attacksEnemyKing(moves: Array<IMove>, ourColour: Colour) {
    const enemyKing = Piece.getKing(ourColour);
    for (let move of moves) {
        if (move.targetPiece == enemyKing) return true;
    }
    return false;
}

export const TerminationApi: ITerminationApi = {
    getTermination(board: IBoard, legalMoves: Array<IMove>, enemyMoves: Array<IMove>): Termination | null {
        // TODO: To implement repetition I need a Move History.

        // TODO: There's a few things I can't implement in here [Like Resign, Timeout, Agreement etc...]

        if (isEmpty(legalMoves)) {
            const attacksOurKing = attacksEnemyKing(enemyMoves, board.toMove);
            if (this.isInMateWhenNoLegalMoves(board, attacksOurKing)) return Terminations.Mate;
            else if (this.isInStalemateWhenNoLegalMoves(board, attacksOurKing)) return Terminations.Stalemate;
        } else {
            if (this.isFiftyMoveRule(board)) return Terminations.FiftyMoveRule;

            else if (this.isInsufficientMaterial(board)) return Terminations.InsufficientMaterial;
        }
        return null;
    },

    isInMateWhenNoLegalMoves(board, attacksOurKing): Colour | null {
        return attacksOurKing ? board.toMove : null;
    },

    isInStalemateWhenNoLegalMoves(board, attacksOurKing): boolean {
        return !attacksOurKing;
    },

    isFiftyMoveRule(board: IBoard): boolean {
        return board.halfMoveNumber >= 50;
    },

    isInsufficientMaterial(board: IBoard): boolean {

        function countKnights(knight: Piece, pieces: Array<Piece>): number {
            return pieces.filter(p => p == knight).length;
        }

        function isPiecesEnough(colour: Colour, pieces: Array<Piece>): boolean {
            return pieces.includes(Piece.getPawn(colour)) ||
                pieces.includes(Piece.getRook(colour)) ||
                pieces.includes(Piece.getQueen(colour)) ||
                countKnights(Piece.getKnight(colour), pieces) >= 2;
        }

        function bishopsEnough(pieces: Array<Piece>): boolean {
            // {Piece-Colour}{Bishop-Square-Colour}
            let whiteWhite = 0;
            let whiteBlack = 0;
            let blackBlack = 0;
            let blackWhite = 0;

            for (let i = 0; i < 64; i++) {
                const piece = pieces[i];
                if (!Piece.isBishop(piece)) continue;

                const pieceColour = (Piece.getColour(piece)) !!;
                const sqColour = Piece.getBishopSquareColour(i as SquareIndex);

                if (pieceColour == Colours.white) {
                    if (sqColour == Colours.white) whiteWhite++;
                    else whiteBlack++;
                } else {
                    if (sqColour == Colours.white) blackWhite++;
                    else blackBlack++;
                }
            }
            return ((whiteWhite > 0) ? 1 : 0) + ((whiteBlack > 0) ? 1 : 0) >= 2 || ((blackBlack > 0) ? 1 : 0) + ((blackWhite > 0) ? 1 : 0) >= 2;
        }

        const whiteEnough = isPiecesEnough(Colours.white, BoardPosition.getAllPiecesByColour(board.position, Colours.white));
        const blackEnough = isPiecesEnough(Colours.black, BoardPosition.getAllPiecesByColour(board.position, Colours.black));

        if (whiteEnough || blackEnough) {
            return false;
        }

        return !bishopsEnough(board.position);
    }
};


export interface ITerminationApi {
    getTermination(board: IBoard, legalMoves: Array<IMove>, enemyMoves: Array<IMove>): Termination | null;

    isInMateWhenNoLegalMoves(board: IBoard, attacksOurKing: boolean): Colour | null;

    isInStalemateWhenNoLegalMoves(board: IBoard, attacksOurKing: boolean): boolean;

    isFiftyMoveRule(board: IBoard): boolean;

    isInsufficientMaterial(board: IBoard): boolean;
}
