import {UCI} from "../src/uci";
import {BoardObj} from "../src/boardObj";
import {SquareIndex} from "../src/square";
import {BoardNotation} from "../src/boardNotation";
import {Piece} from "../src/piece";
import {Figure} from "../src/move";

describe('uci.ts', function () {
    // describe('write', function () {
    //     // test("does not throw", async function () {
    //     //     const board = new BoardObj();
    //     //     await board.fen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    //     //
    //     //     const moves = ["e2e4", "e7e5", "g1f3", "f7f5", "b1c3", "f5e4", "c3e4", "d8h4"];
    //     //
    //     //     var i = 0;
    //     //
    //     //     for (const move of moves) {
    //     //         const legalMoves = await board.legalMoves();
    //     //         const imove = await UCI.parse(move, legalMoves, board.pose())
    //     //         await board.push(imove);
    //     //         i++;
    //     //         console.log(i.toString() + await board.fen());
    //     //     }
    //     //
    //     //     // rnb1kbnr/pppp2pp/8/4p3/4N2q/5N2/PPPP1PPP/R1BQKB1R w KQkq - 1 5
    //     //     expect(await board.fen()).toBe("rnb1kbnr/pppp2pp/8/4p3/4N2q/5N2/PPPP1PPP/R1BQKB1R w KQkq - 1 5");
    //     // });
    //
    //     const data = [
    //         {move: "e2e4", fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1"},
    //         {move: "e7e5", fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2"},
    //         {move: "g1f3", fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2"},
    //         {move: "g8f6", fen: "rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3"},
    //     ]
    //
    //     test("test many moves", async function () {
    //         const board = new BoardObj();
    //         await board.fen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    //
    //         for (const item of data) {
    //             await board.pushUci(item.move);
    //             expect(await board.fen()).toBe(item.fen);
    //             console.log(`move ${item.move}`);
    //         }
    //     });
    //
    //     test("test does not throw by steps", async function() {
    //     //     ["e2e4", "e7e5", "g1f3", "f7f5", "b1c3", "f5e4", "c3e4", "d8h4"];
    //
    //         const t = [
    //             {m: "e2e4", f: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1"},
    //             {m: "e7e5", f: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2"},
    //             {m: "g1f3", f: "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2"},
    //             {m: "f7f5", f: "rnbqkbnr/pppp2pp/8/4pp2/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3"},
    //             {m: "b1c3", f: "rnbqkbnr/pppp2pp/8/4pp2/4P3/2N2N2/PPPP1PPP/R1BQKB1R b KQkq - 1 3"},
    //             {m: "f5e4", f: "rnbqkbnr/pppp2pp/8/4p3/4p3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 0 4"},
    //             {m: "c3e4", f: "rnbqkbnr/pppp2pp/8/4p3/4N3/5N2/PPPP1PPP/R1BQKB1R b KQkq - 0 4"},
    //             {m: "d8h4", f: "rnb1kbnr/pppp2pp/8/4p3/4N2q/5N2/PPPP1PPP/R1BQKB1R w KQkq - 1 5"} ]
    //
    //         const board = new BoardObj();
    //         await board.fen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    //
    //         for (const {m, f} of t) {
    //             await board.pushUci(m);
    //             expect(await board.fen()).toBe(f);
    //             console.log(`after ${m} position should be ${f}`);
    //         }
    //     });
    //
    //     test("jebac disa kurwe", async function() {
    //         const board = new BoardObj();
    //         await board.fen("rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2");
    //         await board.pushUci("g1f3");
    //         const fen = await board.fen();
    //
    //     })
    // });

    const testData = {
        normalMoves: [
            {
                move: "e2e4",
                initialFEN: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
                from: 52,
                to: 52 - 16
            },
            {
                move: "e2e3",
                initialFEN: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
                from: 52,
                to: 52 - 8
            },
            {
                move: "d2d4",
                initialFEN: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
                from: 51,
                to: 51 - 16
            },
            {
                move: "d2d3",
                initialFEN: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
                from: 51,
                to: 51 - 8
            },
            {
                move: "g1f3",
                initialFEN: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
                from: 62,
                to: 45
            },
            {
                move: "g1h3",
                initialFEN: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
                from: 62,
                to: 47
            },
            {
                move: "f1c4",
                initialFEN: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
                from: 61,
                to: BoardNotation.fromBoardNotation("c4")
            },
            {
                move: "f1b5",
                initialFEN: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
                from: 61,
                to: BoardNotation.fromBoardNotation("b5")
            }
        ],

        promotionMoves: [
            {
                move: "a7a8q",
                from: 8,
                to: 0,
                fen: "7k/P7/8/8/8/8/8/7K w - - 0 1",
                expectedFen: "Q6k/8/8/8/8/8/8/7K b - - 0 1",
                promotionTo: "Q"
            },
            {
                move: "a7a8b",
                from: 8,
                to: 0,
                fen: "7k/P7/8/8/8/8/8/7K w - - 0 1",
                expectedFen: "B6k/8/8/8/8/8/8/7K b - - 0 1",
                promotionTo: "B"
            },
            {
                move: "a7a8n",
                from: 8,
                to: 0,
                fen: "7k/P7/8/8/8/8/8/7K w - - 0 1",
                expectedFen: "N6k/8/8/8/8/8/8/7K b - - 0 1",
                promotionTo: "N"
            },
            {
                move: "a7a8r",
                from: 8,
                to: 0,
                fen: "7k/P7/8/8/8/8/8/7K w - - 0 1",
                expectedFen: "R6k/8/8/8/8/8/8/7K b - - 0 1",
                promotionTo: "R"
            },




            {
                move: "h2h1q",
                from: 55,
                to: 63,
                fen: "k7/8/8/8/8/8/K6p/8 b - - 0 1",
                expectedFen: "k7/8/8/8/8/8/K7/7q w - - 0 2",
                promotionTo: "q"
            },
            {
                move: "h2h1b",
                from: 55,
                to: 63,
                fen: "k7/8/8/8/8/8/K6p/8 b - - 0 1",
                expectedFen: "k7/8/8/8/8/8/K7/7b w - - 0 2",
                promotionTo: "b"
            },
            {
                move: "h2h1n",
                from: 55,
                to: 63,
                fen: "k7/8/8/8/8/8/K6p/8 b - - 0 1",
                expectedFen: "k7/8/8/8/8/8/K7/7n w - - 0 2",
                promotionTo: "n"
            },
            {
                move: "h2h1r",
                from: 55,
                to: 63,
                fen: "k7/8/8/8/8/8/K6p/8 b - - 0 1",
                expectedFen: "k7/8/8/8/8/8/K7/7r w - - 0 2",
                promotionTo: "r"
            },

        ],

        castleMoves: [
            {
                move: "e1g1",
                from: 60,
                to: 63,
                fen: "r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1"
            },
            {
                move: "e1c1",
                from: 60,
                to: 56,
                fen: "r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1"
            },
            {
                move: "e8g8",
                from: 4,
                to: 7,
                fen: "r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R b KQkq - 0 1"
            },
            {
                move: "e8c8",
                from: 4,
                to: 0,
                fen: "r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R b KQkq - 0 1"
            }
        ]
    }

    describe('write', function () {
        async function testWrite(from: number, to: number, fen: string, expectedMove: string) {
            const board = new BoardObj();
            await board.fen(fen);
            const legalMoves = await board.legalMoves();
            const movePicked = legalMoves.find(x => x.from == from as SquareIndex && x.to == to as SquareIndex);

            if (movePicked == undefined) {
                throw new Error(`Test: In legal moves move [from -> to] ${from} -> ${to} is not found.`);
            }

            expect(await UCI.write(movePicked, board.pose())).toBe(expectedMove);
        }

        describe("write normal moves", function () {
            for (const {move, initialFEN, from, to} of testData.normalMoves) {
                test(`${from} -> ${to} = ${move}`, async function () {
                    await testWrite(from, to, initialFEN, move);
                });
            }
        });

        describe('write castle', function () {
            for (const {move, from, to, fen} of testData.castleMoves) {
                test(`${from} -> ${to} = ${move}`, async function () {
                    await testWrite(from, to, fen, move);
                });
            }
        });

        describe("write en passant", function () {
            test("en passant - scenario 1", async function () {
                const fen = "rnbqkbnr/1pp1pppp/p7/3pP3/8/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 3";
                const board = new BoardObj();
                await board.fen(fen);
                const move = (await board.legalMoves()).find(x => x.from == BoardNotation.fromBoardNotation("e5") && x.to == BoardNotation.fromBoardNotation("d6"))!!
                expect(await UCI.write(move, board.pose())).toBe("e5d6");
            });
        });

        function toFigure(promotion: string): Figure {
            promotion = promotion.toLowerCase();

            if (promotion == "") {
                throw new Error("promotion can't be empty");
            }

            else if (promotion == "q") return "queen";

            else if (promotion == "r") return "rook";

            else if (promotion == "b") return "bishop";

            else if (promotion == "n") return "knight";

            throw new Error("");
        }

        describe("write promotion moves", function() {
            for (const {move, fen, expectedFen, to, from, promotionTo} of testData.promotionMoves) {
                test(`${from} -> ${to} promo to ${promotionTo}`, async function() {
                    const board = new BoardObj();
                    await board.fen(fen);
                    const legalMoves = await board.legalMoves();
                    const legalMove = legalMoves.find(x => x.from == from as SquareIndex && x.to == to as SquareIndex)!!;
                    legalMove.promotion = toFigure(promotionTo);
                    expect(await UCI.write(legalMove, board.pose())).toBe(move);
                });
            }
        });
    });

    async function testParse(expFrom: number, expTo: number, fen: string, move: string) {
        const board = new BoardObj();
        await board.fen(fen);
        const r = await UCI.parse(move, await board.legalMoves(), board.pose());
        expect(r.from).toBe(expFrom as SquareIndex);
        expect(r.to).toBe(expTo as SquareIndex);
    }

    describe('parse', function () {
        describe('parse normal moves', function () {
            for (const {move, from, to, initialFEN} of testData.normalMoves) {
                test(`${from} -> ${to} = ${move}`, async function () {
                    await testParse(from, to, initialFEN, move);
                });
            }
        });

        describe("parse castle moves", function () {
            for (const {move, from, to, fen} of testData.castleMoves) {
                test(`${from} -> ${to} = ${move}`, async function () {
                    await testParse(from, to, fen, move);
                });
            }
        });

        describe("parse promotion moves", function() {
            for (const {move, from, to, fen, expectedFen} of testData.promotionMoves) {
                test(`${move} makes FEN: ${expectedFen}`, async function() {
                    const board = new BoardObj();
                    await board.fen(fen);
                    let legalMoves = await board.legalMoves();
                    const r = await UCI.parse(move, legalMoves, board.pose());
                    expect(r.from).toBe(from as SquareIndex);
                    expect(r.to).toBe(to as SquareIndex);

                    await board.push(r);
                    expect(await board.fen()).toBe(expectedFen);
                });
            }
        });
    });
});