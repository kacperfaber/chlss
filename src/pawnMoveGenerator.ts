import {IMove} from "./move";
import {BoardPosition} from "./boardPosition";
import {Piece} from "./piece";
import {SquareIndex} from "./square";
import {Colour, Colours} from "./colour";
import {Coords} from "./coords";
import Pieces from "./pieces";

interface IPawnMoveGenerator {
    generatePawnMoves(boardPosition: BoardPosition, piece: Piece, index: SquareIndex, posX: number, posY: number, colour: Colour, moveList: Array<IMove>): Promise<void>;

    validateYPositionToMoveTwoSquare(posY: number, colour: Colour): boolean;

    isOneSquareAheadEmpty(boardPosition: BoardPosition, yDir: number, posX: number, posY: number): Promise<boolean>;

    getYDir(colour: Colour): number;

    tryAddTwoSquareMoveIfLegalAndOneSquareIsEmpty(piece: Piece, boardPosition: BoardPosition, colour: Colour, yDir: number, posX: number, posY: number, index: SquareIndex, moveList: Array<IMove>): Promise<void>;

    addMove(piece: Piece, from: SquareIndex, target: SquareIndex, targetPiece: Piece, moveList: Array<IMove>): void;

    addCaptureMove(boardPosition: BoardPosition, piece: Piece, index: SquareIndex, posX: number, posY: number, colour: Colour, moveList: Array<IMove>): Promise<void>;

    addOneMoveIfOneSquareAheadIsEmpty(piece: Piece, index: SquareIndex, targetIndex: SquareIndex, moveList: Array<IMove>): void;
}

export const PawnMoveGenerator: IPawnMoveGenerator = {
    async generatePawnMoves(boardPosition: BoardPosition, piece: Piece, index: SquareIndex, posX: number, posY: number, colour: Colour, moveList: Array<IMove>) {
        const yDir = this.getYDir(colour);
        const oneSquareAheadEmpty = await this.isOneSquareAheadEmpty(boardPosition, yDir, posX, posY);

        const oneMoveTargetY = posY + yDir;

        if (oneSquareAheadEmpty) {
            await this.tryAddTwoSquareMoveIfLegalAndOneSquareIsEmpty(piece, boardPosition, colour, yDir, posX, posY, index, moveList);
            this.addOneMoveIfOneSquareAheadIsEmpty(piece, index, Coords.toSquareIndex(posX, oneMoveTargetY), moveList);
        }

        await Promise.all([
            this.addCaptureMove(boardPosition, piece, index, posX + 1, oneMoveTargetY, colour, moveList),
            this.addCaptureMove(boardPosition, piece, index, posX - 1, oneMoveTargetY, colour, moveList),
        ]);
    },

    async addCaptureMove(boardPosition: BoardPosition, piece: Piece, index: SquareIndex, posX: number, posY: number, colour: Colour, moveList: Array<IMove>) {
        if (!(await BoardPosition.isInBoard(posX, posY))) return;
        const targetI = Coords.toSquareIndex(posX, posY);
        const targetPiece = await BoardPosition.getPiece(boardPosition, targetI);
        if (await Piece.isEmpty(targetPiece)) return;
        if (await Piece.isEnemy(targetPiece, colour)) return;
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
            targetPiece: targetPiece
        });
    },

    async tryAddTwoSquareMoveIfLegalAndOneSquareIsEmpty(piece: Piece, boardPosition: BoardPosition, colour: Colour, yDir: number, posX: number, posY: number, index: SquareIndex, moveList: Array<IMove>) {
        const targetY = posY + (yDir * 2);
        const targetIndex = Coords.toSquareIndex(posX, targetY);
        if (this.validateYPositionToMoveTwoSquare(posY, colour) && await BoardPosition.isSquareEmpty(boardPosition, targetIndex)) {
            this.addMove(piece, index, targetIndex, Pieces.Empty, moveList)
        }
    },

    getYDir(colour: Colour): number {
        return colour == Colours.white ? -1 : 1;
    },

    validateYPositionToMoveTwoSquare(posY: number, colour: Colour): boolean {
        return (posY == 1 && colour == Colours.black) || (posY == 6 && colour == Colours.white);
    },

    async isOneSquareAheadEmpty(boardPosition: BoardPosition, yDir: number, posX: number, posY: number): Promise<boolean> {
        return await BoardPosition.isEmpty(boardPosition, posX, posY + yDir);
    }
};