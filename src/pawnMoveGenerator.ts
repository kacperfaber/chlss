import {IMove} from "./move";
import {BoardPosition} from "./boardPosition";
import {Piece} from "./piece";
import {SquareIndex} from "./square";
import {Colour, Colours} from "./colour";
import {Coords} from "./coords";
import Pieces from "./pieces";

function isLastSquare(pawnColour: Colour, sq: SquareIndex) {
    const y = Coords.toY(sq);
    return (pawnColour == Colours.white && y == 0) || (pawnColour == Colours.black && y == 7);
}

interface IPawnMoveGenerator {
    generatePawnMoves(boardPosition: BoardPosition, piece: Piece, index: SquareIndex, posX: number, posY: number, colour: Colour, moveList: Array<IMove>, enPassant: SquareIndex | null): void;

    validateYPositionToMoveTwoSquare(posY: number, colour: Colour): boolean;

    isOneSquareAheadEmpty(boardPosition: BoardPosition, yDir: number, posX: number, posY: number): boolean;

    getYDir(colour: Colour): number;

    tryAddTwoSquareMoveIfLegalAndOneSquareIsEmpty(piece: Piece, boardPosition: BoardPosition, colour: Colour, yDir: number, posX: number, posY: number, index: SquareIndex, moveList: Array<IMove>): void;

    addMove(piece: Piece, from: SquareIndex, target: SquareIndex, targetPiece: Piece, moveList: Array<IMove>): void;

    addCaptureMove(boardPosition: BoardPosition, piece: Piece, index: SquareIndex, posX: number, posY: number, colour: Colour, moveList: Array<IMove>): void;

    addOneMoveIfOneSquareAheadIsEmpty(piece: Piece, index: SquareIndex, targetIndex: SquareIndex, moveList: Array<IMove>): void;

    tryAddEnPassant(piece: Piece, colour: Colour, index: SquareIndex, enPassant: SquareIndex | null, yDir: number, posX: number, posY: number, moveList: Array<IMove>): void;

    trySetEnPassantWhenMovesTwoSquare(colour: Colour, boardPosition: BoardPosition, posX: number, posY: number, targetY: number, yDir: number): SquareIndex | null;

    addMoveWithOptionalSetEnPassant(piece: Piece, from: SquareIndex, target: SquareIndex, targetPiece: Piece, moveList: Array<IMove>, setEnPassant: SquareIndex | null): void;
}

export const PawnMoveGenerator: IPawnMoveGenerator = {
    generatePawnMoves(boardPosition: BoardPosition, piece: Piece, index: SquareIndex, posX: number, posY: number, colour: Colour, moveList: Array<IMove>, enPassant: SquareIndex | null) {
        const yDir = this.getYDir(colour);
        const oneMoveTargetY = posY + yDir;

        const oneSquareAheadEmpty = BoardPosition.isEmpty(boardPosition, posX, oneMoveTargetY);

        if (oneSquareAheadEmpty) {
            this.tryAddTwoSquareMoveIfLegalAndOneSquareIsEmpty(piece, boardPosition, colour, yDir, posX, posY, index, moveList);
            this.addOneMoveIfOneSquareAheadIsEmpty(piece, index, Coords.toSquareIndex(posX, oneMoveTargetY), moveList);
        }

        this.addCaptureMove(boardPosition, piece, index, posX + 1, oneMoveTargetY, colour, moveList);
        this.addCaptureMove(boardPosition, piece, index, posX - 1, oneMoveTargetY, colour, moveList);
        this.tryAddEnPassant(piece, colour, index, enPassant, yDir, posX, posY, moveList);
    },

    addCaptureMove(boardPosition: BoardPosition, piece: Piece, index: SquareIndex, posX: number, posY: number, colour: Colour, moveList: Array<IMove>) {
        if (!(BoardPosition.isInBoard(posX, posY))) return;
        const targetI = Coords.toSquareIndex(posX, posY);
        const targetPiece = BoardPosition.getPiece(boardPosition, targetI);
        if (Piece.isEmpty(targetPiece)) return;
        if (!(Piece.isEnemy(targetPiece, colour))) return;
        this.addMove(piece, index, targetI, targetPiece, moveList);
    },

    addOneMoveIfOneSquareAheadIsEmpty(piece: Piece, index: SquareIndex, targetIndex: SquareIndex, moveList: Array<IMove>) {
        this.addMove(piece, index, targetIndex, Pieces.Empty, moveList);
    },

    addMove(piece: Piece, from: SquareIndex, target: SquareIndex, targetPiece: Piece, moveList: Array<IMove>) {
        moveList.push({
            from: from,
            to: target,
            piece: piece,
            targetPiece: targetPiece,
            setEnPassant: null,
            promotion: undefined,
            isPromo: isLastSquare(Piece.getColour(piece) !!, target)
        });
    },

    addMoveWithOptionalSetEnPassant(piece: Piece, from: SquareIndex, target: SquareIndex, targetPiece: Piece, moveList: Array<IMove>, setEnPassant: SquareIndex | null): void {
        moveList.push({
            from: from,
            to: target,
            piece: piece,
            targetPiece: targetPiece,
            setEnPassant: setEnPassant,
            promotion: undefined,
            isPromo: false
        });
    },

    tryAddTwoSquareMoveIfLegalAndOneSquareIsEmpty(piece: Piece, boardPosition: BoardPosition, colour: Colour, yDir: number, posX: number, posY: number, index: SquareIndex, moveList: Array<IMove>) {
        const targetY = posY + (yDir * 2);
        const targetIndex = Coords.toSquareIndex(posX, targetY);
        if (this.validateYPositionToMoveTwoSquare(posY, colour) && BoardPosition.isSquareEmpty(boardPosition, targetIndex)) {
            const setEnPassant = this.trySetEnPassantWhenMovesTwoSquare(colour, boardPosition, posX, posY, targetY, yDir);
            this.addMoveWithOptionalSetEnPassant(piece, index, targetIndex, Pieces.Empty, moveList, setEnPassant);
        }
    },

    getYDir(colour: Colour): number {
        return colour == Colours.white ? -1 : 1;
    },

    validateYPositionToMoveTwoSquare(posY: number, colour: Colour): boolean {
        return (posY == 1 && colour == Colours.black) || (posY == 6 && colour == Colours.white);
    },

    isOneSquareAheadEmpty(boardPosition: BoardPosition, yDir: number, posX: number, posY: number): boolean {
        return BoardPosition.isEmpty(boardPosition, posX, posY + yDir);
    },

    tryAddEnPassant(piece: Piece, colour: Colour, index: SquareIndex, enPassant: SquareIndex | null, yDir: number, posX: number, posY: number, moveList: Array<IMove>): void {
        if (enPassant == null) return;

        function validateIsEnPassantSquareReachable(posX: number, posY: number, enPassantPosX: number, enPassantPosY: number, yDir: number): boolean {
            const expectedY = posY + yDir;
            return (expectedY == enPassantPosY) && (posX + 1 == enPassantPosX || posX - 1 == enPassantPosX);
        }

        const enPassantX = Coords.toX(enPassant);
        const enPassantY = Coords.toY(enPassant);

        if (!validateIsEnPassantSquareReachable(posX, posY, enPassantX, enPassantY, yDir)) return;

        moveList.push({
            from: index,
            to: Coords.toSquareIndex(enPassantX, enPassantY),
            piece: piece,
            targetPiece: Pieces.Empty,
            setEnPassant: null,
            promotion: undefined,
            isPromo: false
        });
    },

    trySetEnPassantWhenMovesTwoSquare(colour: Colour, boardPosition: BoardPosition, posX: number, posY: number, targetY: number, yDir: number): SquareIndex | null {
        function isEnemyPawnStands(posX: number, targetY: number, boardPosition: BoardPosition, colour: Colour): boolean {
            if (BoardPosition.isInBoard(posX + 1, targetY)) {
                const sqIndex = Coords.toSquareIndex(posX + 1, targetY);
                const piece = BoardPosition.getPieceOrNull(boardPosition, sqIndex);
                if (piece == Piece.getPawn(Colours.inverseColour(colour)))
                    return true;
            }

            if (BoardPosition.isInBoard(posX - 1, targetY)) {
                const sqIndex = Coords.toSquareIndex(posX - 1, targetY);
                const piece = BoardPosition.getPieceOrNull(boardPosition, sqIndex);
                if (piece == Piece.getPawn(Colours.inverseColour(colour)))
                    return true;
            }
            return false;
        }

        if (!isEnemyPawnStands(posX, targetY, boardPosition, colour)) return null;

        function getEnPassantSquare(posX: number, targetY: number, yDir: number): SquareIndex {
            return Coords.toSquareIndex(posX, targetY - yDir);
        }

        return getEnPassantSquare(posX, targetY, yDir);
    }
};