interface IPieces {
    WhiteRook: string;
    WhiteKing: string,
    WhiteQueen: string,
    WhitePawn: string,
    WhiteBishop: string,
    WhiteKnight: string,
    BlackRook: string,
    BlackKing: string,
    BlackQueen: string,
    BlackPawn: string,
    BlackBishop: string,
    BlackKnight: string,
    Empty: string
}

const Pieces: IPieces = {
    WhiteRook: 'R',
    WhiteKing: 'K',
    WhiteQueen: 'Q',
    WhitePawn: 'P',
    WhiteBishop: 'B',
    WhiteKnight: 'N',
    BlackRook: 'r',
    BlackKing: 'k',
    BlackQueen: 'q',
    BlackPawn: 'p',
    BlackBishop: 'b',
    BlackKnight: 'n',
    Empty: 'e'
}

export default Pieces;