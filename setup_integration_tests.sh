#!/bin/bash

python test_data_generator/legal_moves_generator.py --output integration_tests/data/legal_moves.json --repeat 500 --random-position-moves 75 &
python test_data_generator/random_games_generator.py --output integration_tests/data/random_games.json --repeat 100 --move-in-case 50