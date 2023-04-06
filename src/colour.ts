export type Colour = "white" | "black";

interface IColours {
    white: Colour;
    black: Colour;
    inverseColour(colour: Colour): Colour;
}

export const Colours: IColours = {
    white: "white",
    black: "black",

    inverseColour(colour: Colour): Colour {
        return colour == Colours.white ? Colours.black : Colours.white;
    }
}