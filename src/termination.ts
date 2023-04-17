export const Terminations = {
    // win / lose

    Mate: 0,
    Timeout: 1,
    Resignation: 2,

    // draws

    Stalemate: 3,
    InsufficientMaterial: 4,
    FiftyMoveRule: 5,
    Repetition: 6,
    Agreement: 7
};

export type Termination = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;