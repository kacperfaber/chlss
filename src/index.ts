/**
 * We have some work TODO...
 * - Configure index.ts to generate automatically.
 * - In some places my naming conventions are broken [Colours.white and Pieces.WhiteQueen].
 * - Created something like 'Line Generator', but using {x,y} offsets [we can use it in Knight and King]
 */

import Pieces from "./pieces";

export {BoardObj} from "./boardObj";
export {UCI} from "./uci";
export {FEN} from "./fen";
export {BoardNotation} from "./boardNotation";
export {Coords} from "./coords";
export {Pieces};
export {Piece} from "./piece"
export {Colour} from "./colour"
export {IMove} from "./move"