import {IBoard} from "./board";
import {BoardPosition} from "./boardPosition";
import {StringBuilder} from "./stringBuilder";
import {Piece} from "./piece";
import Pieces from "./pieces";
import {SquareIndex} from "./square";
import {Castling} from "./castling";
import {Colour, Colours} from "./colour";
import {BoardNotation} from "./boardNotation";

interface IForsythEdwardsNotation {
    writeFEN(board: IBoard): Promise<string>;
    loadFEN(fen: string, board: IBoard): Promise<void>;
    regExp: RegExp;
}

async function writeFENPosition(boardPosition: BoardPosition): Promise<string> {

    const stringBuilder = new StringBuilder();

    function writeSeparator() {
        stringBuilder.append("/");
    }

    function writeEmpty() {
        stringBuilder.append("1");
    }

    function pieceToFenValue(piece: Piece): string {
        switch (piece) {
            case Pieces.WhiteKnight:
                return "N";
            case Pieces.BlackKnight:
                return 'n';
            case Pieces.WhiteKing:
                return 'K';
            case Pieces.BlackKing:
                return 'k';
            case Pieces.WhiteBishop:
                return 'B';
            case Pieces.BlackBishop:
                return 'b';
            case Pieces.BlackPawn:
                return 'p';
            case Pieces.WhitePawn:
                return 'P';
            case Pieces.WhiteRook:
                return 'R';
            case Pieces.BlackRook:
                return 'r';
            case Pieces.BlackQueen:
                return 'q';
            case Pieces.WhiteQueen:
                return 'Q';
        }

        throw new Error(`unknown piece: '${piece}'`);
    }

    for (let index = 0; index < 64; index++) {
        const piece = await BoardPosition.getPiece(boardPosition, index as SquareIndex);

        if ((index) % 8 == 0 && index != 0 && index != 63) {
            writeSeparator();
        }

        if (await Piece.isEmpty(piece)) {
            writeEmpty();
        } else stringBuilder.append(pieceToFenValue(piece));


    }

    return stringBuilder.build().replace(/1+/g, (m) => (m.length).toString());
}

function writeSpace(stringBuilder: StringBuilder): void {
    stringBuilder.append(" ");
}

function writeText(stringBuilder: StringBuilder, text: string): void {
    stringBuilder.append(text);
}

function writeCastling(stringBuilder: StringBuilder, castling: Castling) {
    if (!castling.white.kingSide && !castling.white.queenSide && !castling.black.kingSide && !castling.black.queenSide) {
        stringBuilder.append("-");
        return;
    }

    if (castling.white.kingSide) stringBuilder.append("K");
    if (castling.white.queenSide) stringBuilder.append("Q");
    if (castling.black.kingSide) stringBuilder.append("k");
    if (castling.black.queenSide) stringBuilder.append("q");
}

function writeColour(stringBuilder: StringBuilder, colour: Colour): void {
    stringBuilder.append(colour == Colours.white ? "w" : "b");
}

function writeEnPassant(stringBuilder: StringBuilder, enPassant: SquareIndex | null): void {
    stringBuilder.append(enPassant == null ? "-" : BoardNotation.toBoardNotation(enPassant));
}


function writeNumber(stringBuilder: StringBuilder, i: number): void {
    stringBuilder.append(i.toString());
}

function parseCastlingData(castling: string): Castling {
    return {
        black: {
            queenSide: castling.includes("q"),
            kingSide: castling.includes("k")
        },

        white: {
            queenSide: castling.includes("Q"),
            kingSide: castling.includes("K")
        }
    }
}

function parseEnPassant(enPassant: string): SquareIndex | null {
    return enPassant == "-" ? null : BoardNotation.fromBoardNotation(enPassant);
}

function parseFullMoveCounter(fullMoveCounter: string): number {
    return parseInt(fullMoveCounter);
}

function parseHalfMoveCounter(halfMoveCounter: string): number {
    return parseInt(halfMoveCounter);
}

function isDigit(str: string): number | null{
    const number = parseInt(str);
    return isNaN(number) ? null : number;
}

async function parseFENPosition(position: string, boardPosition: BoardPosition): Promise<void> {
    let index = 0;

    function fenValueToPiece(fenValue: string): Piece {
        switch (fenValue) {
            case 'N':
                return Pieces.WhiteKnight;
            case 'n':
                return Pieces.BlackKnight;
            case 'K':
                return Pieces.WhiteKing;
            case 'k':
                return Pieces.BlackKing;
            case 'B':
                return Pieces.WhiteBishop;
            case 'b':
                return Pieces.BlackBishop;
            case 'p':
                return Pieces.BlackPawn;
            case 'P':
                return Pieces.WhitePawn;
            case 'R':
                return Pieces.WhiteRook;
            case 'r':
                return Pieces.BlackRook;
            case 'q':
                return Pieces.BlackQueen;
            case 'Q':
                return Pieces.WhiteQueen;
            default:
                throw new Error(`unknown FEN value: '${fenValue}'`);
        }
    }

    for (let char of position) {
        if (char == "/") continue;

        const digit = isDigit(char);

        if (digit != null) {
            for (let eX = 0; eX<digit; eX++) {
                const square = index + eX;
                BoardPosition.setEmpty(boardPosition, square);
            }
            index += digit;
        }

        else {
            let piece = fenValueToPiece(char);
            await BoardPosition.setPiece(boardPosition, index as SquareIndex, piece);

            index += 1;
        }
    }
}

function parseColourToMove(colourStr: string): Colour {
    switch (colourStr) {
        case "w":
            return Colours.white;
        case "b":
            return Colours.black;
        default: throw new Error("invalid fen");
    }
}

export const FEN: IForsythEdwardsNotation = {
    async writeFEN(board: IBoard): Promise<string> {
        const stringBuilder = new StringBuilder();

        writeText(stringBuilder, await writeFENPosition(board.position));

        writeSpace(stringBuilder);

        writeColour(stringBuilder, board.toMove);

        writeSpace(stringBuilder);

        writeCastling(stringBuilder, board.castling);

        writeSpace(stringBuilder);

        writeEnPassant(stringBuilder, board.enPassant);

        writeSpace(stringBuilder);

        writeNumber(stringBuilder, board.halfMoveNumber);

        writeSpace(stringBuilder);

        writeNumber(stringBuilder, board.fullMoveCounter);

        return stringBuilder.build();
    },

    regExp: new RegExp(/([rnbqkRQNBKPp12345678/]+) ([wb]) ([KQkq-]+) (.+) (\d+) (\d+)/),

    async loadFEN(fen: string, board: IBoard): Promise<void> {
        const match = this.regExp.exec(fen);
        if (match == null) throw new Error("invalid fen");
        await parseFENPosition(match[1], board.position);
        board.toMove = parseColourToMove(match[2]);
        board.castling = parseCastlingData(match[3]);
        board.enPassant = parseEnPassant(match[4]);
        board.halfMoveNumber = parseHalfMoveCounter(match[5]);
        board.fullMoveCounter = parseFullMoveCounter(match[6]);
    }
};