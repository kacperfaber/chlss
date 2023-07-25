import {SquareIndex} from "./square";
import {Piece} from "./piece";


/*
Move implementation:

1. Castling - 'from' and 'piece' targets king, 'targetPiece' and 'to' targets our rook.
Castling Move is legal. It means I'm not creating a undo castle because I don't test it.

2. En Passant:
'targetPiece' is set to enemy pawn, but the 'to' square is empty. Then we have to calculate the pawn
position to take.

Besides - when IMove that allows enemy to respond with en passant and we need to set en passant on board...
Then IMove 'setEnPassant' is set to square.

3. Other situations:
We can just replace 'piece' with piece on the 'to', and set 'from' square empty.

 */

export type Figure = "knight" | "bishop" | "queen" | "rook";

export interface IMove {
    from: SquareIndex;
    to: SquareIndex;
    piece: Piece;
    targetPiece: Piece;
    setEnPassant: SquareIndex | null;
    promotion: Figure | undefined;
}
