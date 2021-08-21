export class DataBaseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DataBaseError";
    }
}
export class CommandError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CommandError";
    }
}
export class PageLimitError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "PageLimit";
    }
}
export class PermissionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "PermissionError";
    }
}