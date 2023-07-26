import {FEN} from "./fen";
import {Board} from "./board";
import {IMove} from "./move";
import {MoveGenerator} from "./moveGenerator";
import {MoveMaker} from "./moveMaker";
import {BoardPosition} from "./boardPosition";
import {UCI} from "./uci";

export class BoardObj {
    private board = Board.createEmpty();

    async fen(setFen: string | undefined = undefined): Promise<string> {
        if (!setFen) return FEN.writeFEN(this.board);
        await FEN.loadFEN(setFen, this.board);
        return setFen;
    }

    pose(): BoardPosition {
        return this.board.position;
    }

    async pushUci(uci: string): Promise<void> {
        const legalMoves = await this.legalMoves();
        const move = await UCI.parse(uci, legalMoves, this.board.position);
        await this.push(move);
    }

    async legalMoves(): Promise<Array<IMove>> {
        return await MoveGenerator.generateLegalMoves(this.board, this.board.toMove);
    }

    async push(move: IMove): Promise<void> {
        return await MoveMaker.makeMoveAsync(this.board, move);
    }
}