import {IBoard} from "./board";
import {BoardPosition} from "./boardPosition";
import {StringBuilder} from "./stringBuilder";
import {Piece} from "./piece";
import Pieces from "./pieces";
import {SquareIndex} from "./square";
import {Castling} from "./castling";
import {Colour, Colours} from "./colour";

interface IForsythEdwardsNotation {
    writeFEN(board: IBoard): Promise<string>;
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
    if (castling.white.kingSide) stringBuilder.append("K");
    if (castling.white.queenSide) stringBuilder.append("Q");
    if (castling.black.kingSide) stringBuilder.append("k");
    if (castling.white.queenSide) stringBuilder.append("q");
}

function writeColour(stringBuilder: StringBuilder, colour: Colour): void {
    stringBuilder.append(colour == Colours.white ? "w" : "b");
}

function writeEnPassant(stringBuilder: StringBuilder, enPassant: string | null): void {
    stringBuilder.append(enPassant ?? "-");
}


function writeNumber(stringBuilder: StringBuilder, i: number): void {
    stringBuilder.append(i.toString());
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


};