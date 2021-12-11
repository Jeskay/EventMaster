
export class ConditionError extends Error{
    name: string = "ConditionError";
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, ConditionError.prototype);
    }
}
export class DataBaseError extends Error{
    name: string = "DataBaseError";
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, DataBaseError.prototype);
    }
}

export class CommandError extends Error{
    name: string = "CommandError";
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, CommandError.prototype);
    }
}

export class PageLimitError extends Error{
    name: string = "PageLimitError";
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, PageLimitError.prototype);
    }
}

export class PermissionError extends Error{
    name: string = "PermissionError";
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, PermissionError.prototype);
    }
}