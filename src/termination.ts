import {IBoard} from "./board";
import {IMove} from "./move";
import {Colour, Colours} from "./colour";
import {Piece} from "./piece";
import {BoardPosition} from "./boardPosition";
import {SquareIndex} from "./square";

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
    async getTermination(board: IBoard, legalMoves: Array<IMove>, enemyMoves: Array<IMove>): Promise<Termination | null> {
        // TODO: To implement repetition I need a Move History.

        // TODO: There's a few things I can't implement in here [Like Resign, Timeout, Agreement etc...]

        if (isEmpty(legalMoves)) {
            // TODO: Twice call of 'attacksEnemyKing' in these functions.
            if (await this.isInMateWhenNoLegalMoves(board, enemyMoves)) return Terminations.Mate;
            else if (await this.isInStalemateWhenNoLegalMoves(board, enemyMoves)) return Terminations.Stalemate;
        } else {
            if (await this.isFiftyMoveRule(board)) return Terminations.FiftyMoveRule;

            else if (await this.isInsufficientMaterial(board)) return Terminations.InsufficientMaterial;
        }
        return null;
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

        function countKnights(knight: Piece, pieces: Array<Piece>): number {
            return pieces.filter(p => p == knight).length;
        }

        function isPiecesEnough(colour: Colour, pieces: Array<Piece>): boolean {
            return pieces.includes(Piece.getPawn(colour)) ||
                pieces.includes(Piece.getRook(colour)) ||
                pieces.includes(Piece.getQueen(colour)) ||
                countKnights(Piece.getKnight(colour), pieces) >= 2;
        }

        async function bishopsEnough(pieces: Array<Piece>): Promise<boolean> {
            // {Piece-Colour}{Bishop-Square-Colour}
            let whiteWhite = 0;
            let whiteBlack = 0;
            let blackBlack = 0;
            let blackWhite = 0;

            for (let i = 0; i < 64; i++) {
                const piece = pieces[i];
                if (!Piece.isBishop(piece)) continue;

                const pieceColour = (await Piece.getColour(piece)) !!;
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

        const whiteEnough = isPiecesEnough(Colours.white, await BoardPosition.getAllPiecesByColour(board.position, Colours.white));
        const blackEnough = isPiecesEnough(Colours.black, await BoardPosition.getAllPiecesByColour(board.position, Colours.black));

        if (whiteEnough || blackEnough) {
            return false;
        }

        return !await bishopsEnough(board.position);
    }
};


export interface ITerminationApi {
    getTermination(board: IBoard, legalMoves: Array<IMove>, enemyMoves: Array<IMove>): Promise<Termination | null>;

    isInMateWhenNoLegalMoves(board: IBoard, enemyMoves: Array<IMove>): Promise<Colour | null>;

    isInStalemateWhenNoLegalMoves(board: IBoard, enemyMoves: Array<IMove>): Promise<boolean>;

    isFiftyMoveRule(board: IBoard): Promise<boolean>;

    isInsufficientMaterial(board: IBoard): Promise<boolean>;
}
