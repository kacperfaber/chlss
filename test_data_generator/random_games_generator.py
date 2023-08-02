import chess
import random
import argparse
import json
import sys


class App:
    def __init__(self, output, repeat, move_in_case, starting_fen: str):
        self.output = output
        self.repeat = repeat
        self.move_in_case = move_in_case
        self.starting_fen = starting_fen
        self.results = []

    def __construct_result(self):
        return {"startingFen": self.starting_fen, "tests": self.results}

    def __write_output(self):
        text = json.dumps(self.__construct_result())
        with open(self.output, mode="w+") as file:
            file.seek(0)
            file.write(text)

    def run(self):
        for i in range(self.repeat):
            print(f"{i} of {self.repeat}", end='\r')
            self.results.append(self.__exec())
        self.__write_output()

    # noinspection PyMethodMayBeStatic
    def __get_all_uci(self, board: chess.Board) -> [str]:
        return [move.uci() for move in board.legal_moves]

    def __push_random_move(self, board: chess.Board, moves: [str]):
        legal_moves = self.__get_all_uci(board)
        random_index = random.randint(0, len(legal_moves)) - 1

        if len(legal_moves) == 0:
            return None

        picked_move = legal_moves[random_index]
        board.push_uci(picked_move)
        moves.append(picked_move)
        return board.fen()

    def __exec(self):
        b = chess.Board(self.starting_fen)
        moves = []
        last_fen = None

        for i in range(self.move_in_case):
            fen_or_none = self.__push_random_move(b, moves)
            if fen_or_none is None:
                break
            last_fen = fen_or_none

        return {'id': random.randint(0, 100000), 'moves': moves, 'fen': last_fen}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description="python CLI to generate JSON random games data - for testing 'github.com/kacperfaber/chlss-ts'"
    )

    parser.add_argument("--output", type=str, required=True)
    parser.add_argument("--repeat", type=int, required=True)
    parser.add_argument("--move-in-case", type=int, required=True)
    parser.add_argument("--starting-fen", type=str, default="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")

    args = parser.parse_args()

    App(args.output, args.repeat, args.move_in_case, args.starting_fen).run()

    sys.stdout.flush()
    print("OK\t\t\t\t\t")
