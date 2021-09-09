"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.finish = exports.start = exports.announce = void 0;
function announce(client, author, guild, description, title, image) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield client.occasionController.announce(client, description, guild, author, title, image);
    });
}
exports.announce = announce;
function start(client, author, guild, title, description) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield client.occasionController.start(client, guild, author, title, description);
    });
}
exports.start = start;
function finish(client, author, guild, results) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield client.occasionController.finish(client, guild, author, results);
    });
}
exports.finish = finish;
