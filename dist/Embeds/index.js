"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.infoColor = exports.errorColor = exports.confirmColor = exports.defaultImageUrl = void 0;
exports.defaultImageUrl = "http://images.gofreedownload.net/3/party-background-joyful-people-flag-ribbon-cartoon-design-262438.jpg";
exports.confirmColor = "GREEN";
exports.errorColor = "RED";
exports.infoColor = "YELLOW";
__exportStar(require("./buttons"), exports);
__exportStar(require("./info"), exports);
__exportStar(require("./profile"), exports);
__exportStar(require("./responses"), exports);
