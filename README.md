# chlss

Simple chess library, well typed by **TypeScript**.

## Versions

| #            |    DATE    | TYPE |
|--------------|:----------:|------|
| 1.0.0-beta.1 | 07.08.2023 | beta |
| 1.0.0-beta.2 | 21.08.2023 | beta |
| 1.0.0-beta.3 | 21.08.2023 | beta |
| 1.0.0-beta.4 | 23.08.2023 | beta |
| 1.0.0-beta.5 | 23.08.2023 | beta |

## Installation

```bash
npm i chlss
```

## Tutorial

#### 1. Initialize the board

```ts
import {BoardObj} from "chlss";

// Will create an empty board,
const board = new BoardObj();

// You can use constructor 
// parameter to specify initial FEN.

const boardWithFen = new BoardObj("<invalid-fen😅>");
```

#### 2. Set FEN on board

```ts
const board = new BoardObj();

// Will load FEN position "FEN" to board.
board.fen("FEN");
```

#### 3. Get the legal moves

```ts
import {IMove} from "./move";
const board = new BoardObj();

// Will return all legal moves in UCI.
const uci: string[] = board.legalMovesUci();

// Will return moves as chlss move.
const moves: IMove[] = board.legalMoves();
```

#### 4. Push the move

```ts
const board = new BoardObj();

// Will push e4 move.
boardObj.pushUci("e2e4");
```

#### 5. Get FEN representation of board.

```ts
const board = new BoardObj();

// Will return FEN representation of the board.
const fen = board.fen();
```

#### 6. Is the game ended?

```ts
import {Termination} from "./termination";

const board = new BoardObj();

// Will return instance of Termination, 
// if the game is ended.
let t: Termination | undefined = board.getTermination();
```

#### 7. Get colour to move

```ts
const board = new BoardObj();

// Will return colour to move.
const toMove: Colour = board.getColour();
```

## Reporting an issues

**chlss** is well tested using thousands of random positions, but please report any issue you will see.
<br>
<br>
Thank You 😎

## Author

Kacper Faber