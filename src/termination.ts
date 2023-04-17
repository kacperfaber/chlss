import {IBoard} from "./board";
import {IMove} from "./move";
import {Colour} from "./colour";
import {Piece} from "./piece";

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

export interface ITerminationApi {
    getTermination(board: IBoard, legalMoves: Array<IMove>, enemyMoves: Array<IMove>): Promise<Termination | null>;

    isInMateWhenNoLegalMoves(board: IBoard, enemyMoves: Array<IMove>): Promise<Colour | null>;

    isInStalemateWhenNoLegalMoves(board: IBoard, enemyMoves: Array<IMove>): Promise<boolean>;

    isFiftyMoveRule(board: IBoard): Promise<boolean>;

    isInsufficientMaterial(board: IBoard): Promise<boolean>;
}

export const TerminationApi: ITerminationApi = {
    async getTermination(board: IBoard, legalMoves: Array<IMove>, enemyMoves: Array<IMove>): Promise<Termination | null> {
        // TODO: To implement repetition I need a Move History.

        // TODO: There's a few things I can't implement in here [Like Resign, Timeout, Agreement etc...]

        if (isEmpty(legalMoves)) {
            // TODO: Twice call of 'attacksEnemyKing' in these functions.
            if (await this.isInMateWhenNoLegalMoves(board, enemyMoves)) return Terminations.Mate;
            else if (await this.isInStalemateWhenNoLegalMoves(board, enemyMoves)) return Terminations.Stalemate;
        }
        else {
            if (await this.isFiftyMoveRule(board)) return Terminations.FiftyMoveRule;


        }
        return null;

        /*

        if (legalMoves is empty)
        stalemate, mate

        else
        others...
         */
    },

    async isInMateWhenNoLegalMoves(board, enemyMoves): Promise<Colour | null> {
        return attacksEnemyKing(enemyMoves, board.toMove) ? board.toMove : null;
    },

    async isInStalemateWhenNoLegalMoves(board, enemyMoves): Promise<boolean> {
        return !attacksEnemyKing(enemyMoves, board.toMove);
    },

    async isFiftyMoveRule(board: IBoard): Promise<boolean> {
        return board.halfMoveNumber >= 50;
    },

    async isInsufficientMaterial(board: IBoard): Promise<boolean> {
        // TODO: Not implemented.
        return false;
    }
};