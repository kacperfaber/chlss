export const RangeUtils= {
    forRangeGeneric<T>(from: number, to: number, act: (current: T) => void) {
        this.forRange(from, to, (x) => act(x as T));
    },

    forRange(from: number, to: number, act: (current: number) => void) {
        for (let x = from; x < to; x++) {
            act(x);
        }
    }
}