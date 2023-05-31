import {FEN} from "./fen";
import {Board} from "./board";
import {IMove} from "./move";
import {MoveGenerator} from "./moveGenerator";
import {MoveMaker} from "./moveMaker";

export class BoardObj {
    private board = Board.createEmpty();

    async fen(setFen: string | undefined = undefined): Promise<string> {
        if (!setFen) return FEN.writeFEN(this.board);
        await FEN.loadFEN(setFen, this.board);
        return setFen;
    }

    async legalMoves(): Promise<Array<IMove>> {
        return await MoveGenerator.generateLegalMoves(this.board, this.board.toMove);
    }

    async push(move: IMove): Promise<void> {
        return await MoveMaker.makeMoveAsync(this.board, move);
    }
}