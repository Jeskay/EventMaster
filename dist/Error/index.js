"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionError = exports.PageLimitError = exports.CommandError = exports.DataBaseError = void 0;
class DataBaseError extends Error {
    constructor(message) {
        super(message);
        this.name = "DataBaseError";
    }
}
exports.DataBaseError = DataBaseError;
class CommandError extends Error {
    constructor(message) {
        super(message);
        this.name = "CommandError";
    }
}
exports.CommandError = CommandError;
class PageLimitError extends Error {
    constructor(message) {
        super(message);
        this.name = "PageLimit";
    }
}
exports.PageLimitError = PageLimitError;
class PermissionError extends Error {
    constructor(message) {
        super(message);
        this.name = "PermissionError";
    }
}
exports.PermissionError = PermissionError;
