interface IStringBuilder {
    append(...str: Array<string>): void;

    init(...str: Array<string>): void;

    build(): string;
}

export class StringBuilder implements IStringBuilder {
    data: Array<string> = [];

    append(...str: Array<string>): void {
        this.data.push(...str);
    }

    build(): string {
        return this.data.join("");
    }

    init(...str: Array<string>): void {
        this.data = str;
    }

    constructor(...str: Array<string>) {
        this.init(...str);
    }
}