"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelperManager = void 0;
class HelperManager {
    extractID(input) {
        console.log(input);
        const extracted = input.substr(2, input.length - 3);
        console.log(extracted);
        return extracted;
    }
}
exports.HelperManager = HelperManager;
