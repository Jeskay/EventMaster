"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionError = exports.PageLimitError = exports.CommandError = exports.DataBaseError = exports.ConditionError = void 0;
class ConditionError extends Error {
    constructor(message) {
        super(message);
        this.name = "ConditionError";
        Object.setPrototypeOf(this, ConditionError.prototype);
    }
}
exports.ConditionError = ConditionError;
class DataBaseError extends Error {
    constructor(message) {
        super(message);
        this.name = "DataBaseError";
        Object.setPrototypeOf(this, DataBaseError.prototype);
    }
}
exports.DataBaseError = DataBaseError;
class CommandError extends Error {
    constructor(message) {
        super(message);
        this.name = "CommandError";
        Object.setPrototypeOf(this, CommandError.prototype);
    }
}
exports.CommandError = CommandError;
class PageLimitError extends Error {
    constructor(message) {
        super(message);
        this.name = "PageLimitError";
        Object.setPrototypeOf(this, PageLimitError.prototype);
    }
}
exports.PageLimitError = PageLimitError;
class PermissionError extends Error {
    constructor(message) {
        super(message);
        this.name = "PermissionError";
        Object.setPrototypeOf(this, PermissionError.prototype);
    }
}
exports.PermissionError = PermissionError;
