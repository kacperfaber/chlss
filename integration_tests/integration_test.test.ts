// @ts-ignore
import randomGamesData from "./data/random_games.json";

// @ts-ignore
import legalMovesData from "./data/legal_moves.json";

import {BoardObj} from "../src/boardObj";

describe("integration_tests", function () {
    /**
     * Using ./data/random_games.json, which contain list of UCI moves and expected final position FEN.
     * package.json commands:
     * generate-empty-random-games: Generates file with 0 test case '[]'.
     * generate-random-games: Generates file with 100 cases, 50 move in case
     */
    describe("random-games", function () {
        for (const {moves, fen, id} of randomGamesData.tests) {
            test(`${id}: expected: ${fen}`, async function () {
                const board = new BoardObj(randomGamesData.startingFen);

                for (const move of moves) {
                    board.pushUci(move);
                }

                expect(board.fen()).toBe(fen);
            });
        }
    });

    /**
     * Using ./data/legal_moves.json, which contain position FEN and list of possible legal moves.
     * package.json commands:
     * generate-empty-legal-moves: Generates file with 0 test case '[]'.
     * generate-legal-moves: Generates file with 500 cases, 75 move made position.
     */
    describe("legal-moves", function () {

        for (const {legalMoves, legalMovesCount, id, fen} of legalMovesData) {
            test(`${id}: ${fen} - expected ${legalMovesCount} legal moves`, async function () {
                const board = new BoardObj(fen);

                const resultUci = board.legalMovesUci();

                for (const legalMove of legalMoves) {
                    const res = resultUci.some(x => x == legalMove);
                    expect(res).toBeTruthy();
                }

                expect(resultUci.length).toBe(legalMoves.length);
            });
        }
    });
});