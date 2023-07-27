import {IMove} from "./move";
import {BoardPosition} from "./boardPosition";
import {Piece} from "./piece";
import {SquareIndex} from "./square";
import {Colour, Colours} from "./colour";
import {Coords} from "./coords";
import Pieces from "./pieces";

interface IPawnMoveGenerator {
    generatePawnMoves(boardPosition: BoardPosition, piece: Piece, index: SquareIndex, posX: number, posY: number, colour: Colour, moveList: Array<IMove>, enPassant: SquareIndex | null): Promise<void>;

    validateYPositionToMoveTwoSquare(posY: number, colour: Colour): boolean;

    isOneSquareAheadEmpty(boardPosition: BoardPosition, yDir: number, posX: number, posY: number): Promise<boolean>;

    getYDir(colour: Colour): number;

    tryAddTwoSquareMoveIfLegalAndOneSquareIsEmpty(piece: Piece, boardPosition: BoardPosition, colour: Colour, yDir: number, posX: number, posY: number, index: SquareIndex, moveList: Array<IMove>): Promise<void>;

    addMove(piece: Piece, from: SquareIndex, target: SquareIndex, targetPiece: Piece, moveList: Array<IMove>): void;

    addCaptureMove(boardPosition: BoardPosition, piece: Piece, index: SquareIndex, posX: number, posY: number, colour: Colour, moveList: Array<IMove>): Promise<void>;

    addOneMoveIfOneSquareAheadIsEmpty(piece: Piece, index: SquareIndex, targetIndex: SquareIndex, moveList: Array<IMove>): void;

    tryAddEnPassant(piece: Piece, colour: Colour, index: SquareIndex, enPassant: SquareIndex | null, yDir: number, posX: number, posY: number, moveList: Array<IMove>): Promise<void>;

    trySetEnPassantWhenMovesTwoSquare(colour: Colour, boardPosition: BoardPosition, posX: number, posY: number, targetY: number, yDir: number): Promise<SquareIndex | null>;

    addMoveWithOptionalSetEnPassant(piece: Piece, from: SquareIndex, target: SquareIndex, targetPiece: Piece, moveList: Array<IMove>, setEnPassant: SquareIndex | null): Promise<void>;
}

export const PawnMoveGenerator: IPawnMoveGenerator = {
    async generatePawnMoves(boardPosition: BoardPosition, piece: Piece, index: SquareIndex, posX: number, posY: number, colour: Colour, moveList: Array<IMove>, enPassant: SquareIndex | null) {
        const yDir = this.getYDir(colour);
        const oneMoveTargetY = posY + yDir;

        const oneSquareAheadEmpty = await BoardPosition.isEmpty(boardPosition, posX, oneMoveTargetY);

        if (oneSquareAheadEmpty) {
            await this.tryAddTwoSquareMoveIfLegalAndOneSquareIsEmpty(piece, boardPosition, colour, yDir, posX, posY, index, moveList);
            this.addOneMoveIfOneSquareAheadIsEmpty(piece, index, Coords.toSquareIndex(posX, oneMoveTargetY), moveList);
        }

        await Promise.all([
            this.addCaptureMove(boardPosition, piece, index, posX + 1, oneMoveTargetY, colour, moveList),
            this.addCaptureMove(boardPosition, piece, index, posX - 1, oneMoveTargetY, colour, moveList),
            this.tryAddEnPassant(piece, colour,index, enPassant, yDir, posX, posY, moveList)
        ]);
    },

    async addCaptureMove(boardPosition: BoardPosition, piece: Piece, index: SquareIndex, posX: number, posY: number, colour: Colour, moveList: Array<IMove>) {
        if (!(await BoardPosition.isInBoard(posX, posY))) return;
        const targetI = Coords.toSquareIndex(posX, posY);
        const targetPiece = await BoardPosition.getPiece(boardPosition, targetI);
        if (await Piece.isEmpty(targetPiece)) return;
        if (!(await Piece.isEnemy(targetPiece, colour))) return;
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
            isPromo: false
        });
    },

    async addMoveWithOptionalSetEnPassant(piece: Piece, from: SquareIndex, target: SquareIndex, targetPiece: Piece, moveList: Array<IMove>, setEnPassant: SquareIndex | null): Promise<void> {
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

    async tryAddTwoSquareMoveIfLegalAndOneSquareIsEmpty(piece: Piece, boardPosition: BoardPosition, colour: Colour, yDir: number, posX: number, posY: number, index: SquareIndex, moveList: Array<IMove>) {
        const targetY = posY + (yDir * 2);
        const targetIndex = Coords.toSquareIndex(posX, targetY);
        if (this.validateYPositionToMoveTwoSquare(posY, colour) && await BoardPosition.isSquareEmpty(boardPosition, targetIndex)) {
            const setEnPassant = await this.trySetEnPassantWhenMovesTwoSquare(colour, boardPosition, posX, posY, targetY, yDir);
            await this.addMoveWithOptionalSetEnPassant(piece, index, targetIndex, Pieces.Empty, moveList, setEnPassant);
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
    },

    async tryAddEnPassant(piece: Piece, colour: Colour, index: SquareIndex, enPassant: SquareIndex | null, yDir: number, posX: number, posY: number, moveList: Array<IMove>): Promise<void> {
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

    async trySetEnPassantWhenMovesTwoSquare(colour: Colour, boardPosition: BoardPosition, posX: number, posY: number, targetY: number, yDir: number): Promise<SquareIndex | null> {
        async function isEnemyPawnStands(posX: number, targetY: number, boardPosition: BoardPosition, colour: Colour): Promise<boolean> {
            if (await BoardPosition.isInBoard(posX + 1, targetY)) {
                const sqIndex = Coords.toSquareIndex(posX + 1, targetY);
                const piece = await BoardPosition.getPieceOrNull(boardPosition, sqIndex);
                if (piece == Piece.getPawn(Colours.inverseColour(colour)))
                    return true;
            } else if (await BoardPosition.isInBoard(posX - 1, targetY)) {
                const sqIndex = Coords.toSquareIndex(posX - 1, targetY);
                const piece = await BoardPosition.getPieceOrNull(boardPosition, sqIndex);
                if (piece == Piece.getPawn(Colours.inverseColour(colour)))
                    return true;
            }
            return false;
        }

        if (!await isEnemyPawnStands(posX, targetY, boardPosition, colour)) return null;

        async function getEnPassantSquare(posX: number, targetY: number, yDir: number): Promise<SquareIndex> {
            return Coords.toSquareIndex(posX, targetY - yDir);
        }

        return await getEnPassantSquare(posX, targetY, yDir);
    }
};