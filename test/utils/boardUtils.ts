import {FEN} from "../../src/fen";
import {Board, IBoard} from "../../src/board";

export async function fromFEN(fen: string): Promise<IBoard> {
    const board = Board.createEmpty();
    await FEN.loadFEN(fen, board);
    return board;
}