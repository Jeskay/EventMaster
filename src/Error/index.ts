export class DataBaseError extends Error {
    constructor(message) {
        super(message);
        this.name = "DataBaseError";
    }
}
export class CommandError extends Error {
    constructor(message) {
        super(message);
        this.name = "CommandError";
    }
}
export class PageLimitError extends Error {
    constructor(message) {
        super(message);
        this.name = "PageLimit";
    }
}