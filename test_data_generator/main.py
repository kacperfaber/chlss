import sys

import chess
import random
import argparse


def get_all_uci(board) -> [str]:
    arr = []
    for m in board.legal_moves:
        arr.append(m.uci())
    return arr


def push_random_move(board: chess.Board, moves: [str]):
    legal_moves = get_all_uci(board)
    random_index = random.randint(0, len(legal_moves)) - 1
    if len(legal_moves) == 0:
        return None
    picked_move = legal_moves[random_index]
    board.push_uci(picked_move)
    moves.append(picked_move)
    return board.fen()


def exec(starting_fen):
    b = chess.Board(starting_fen)
    moves = []
    last_fen = None

    for i in range(50):
        last_fen = push_random_move(b, moves)

    return {'moves': moves, 'final_fen': last_fen, 'starting_fen': starting_fen}


class App:
    def __init__(self, output, repeat, move_in_case, starting_fen):
        print("App's running...")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="python CLI to generate JSON test data, for testing 'github.com/kacperfaber/chlss-ts'")
    parser.add_argument("--output", type=str, required=True)
    parser.add_argument("--repeat", type=int, required=True)
    parser.add_argument("--move-in-case", type=int, required=True)
    parser.add_argument("--starting-fen", type=str, default="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")

    args = parser.parse_args()

    App(args.output, args.repeat, args.move_in_case, args.starting_fen)
