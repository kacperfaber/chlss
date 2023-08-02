import argparse
import chess
import random
import json
import os

class App:
    def __init__(self, repeat, output, random_position_moves):
        self.repeat = repeat
        self.output = output
        self.random_position_moves = random_position_moves

    def __create_random_board(self) -> chess.Board:
        board = chess.Board("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
        for i in range(self.random_position_moves):
            legal_uci_moves = self.__get_legal_uci_moves(board)
            if len(legal_uci_moves) == 0:
                return board
            move = legal_uci_moves[random.randint(0, len(legal_uci_moves) - 1)]
            board.push_uci(move)
        return board

    def __get_legal_uci_moves(self, board: chess.Board):
        return [move.uci() for move in board.legal_moves]

    def __exec(self, iteration):
        board = self.__create_random_board()
        fen = board.fen()
        legal_moves = self.__get_legal_uci_moves(board)
        return {'fen': fen, 'legalMoves': legal_moves, 'legalMovesCount': len(legal_moves), 'id': iteration}

    def __write_results(self, results):
        dirname = os.path.dirname(self.output)
        if not os.path.exists(dirname):
                os.makedirs(dirname)
        with open(self.output, "w+") as file:
            file.write(json.dumps(results))

    def run(self):
        results = []

        for i in range(self.repeat):
            results.append(self.__exec(iteration=i))
            print(f"{i}/{self.repeat}", end='\r')

        self.__write_results(results)
        print("OK")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description="python CLI to generate JSON fen position and expected legal moves [in UCI] - for testing 'github.com/kacperfaber/chlss-ts'"
    )

    parser.add_argument("--repeat", type=int, required=True)
    parser.add_argument("--output", type=str, required=True)
    parser.add_argument("--random-position-moves", type=int, required=True)

    args = parser.parse_args()

    App(args.repeat, args.output, args.random_position_moves).run()
