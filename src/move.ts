import {SquareIndex} from "./square";
import {Piece} from "./piece";


/*
Move implementation:

1. Castling - TODO:

2. En Passant:
'targetPiece' is set to enemy pawn, but the 'to' square is empty. Then we have to calculate the pawn
position to take.

3. Other situations:
We can just replace 'piece' with piece on the 'to', and set 'from' square empty.

 */


export interface IMove {
    from: SquareIndex;
    to: SquareIndex;
    piece: Piece;
    targetPiece: Piece;
}
