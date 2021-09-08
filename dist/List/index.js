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
exports.List = void 0;
const discord_js_1 = require("discord.js");
class List {
    constructor(lifetime, content, fieldsView) {
        this.lifetime = lifetime;
        this.content = content;
        this.fields = fieldsView < 25 ? fieldsView : 25;
        this.message_page = new discord_js_1.Collection();
        this.limit = Math.ceil(content.fields.length / this.fields);
    }
    updateEmbed(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = messageId ? this.message_page[messageId] : 1;
            if (isNaN(page))
                throw Error("Message is not tracking anymore.");
            const newContent = Object.create(this.content);
            const startingIndex = (page - 1) * this.fields;
            newContent.fields = newContent.fields.slice(startingIndex, startingIndex + this.fields);
            newContent.setFooter(`${page}/${this.limit}`);
            return newContent;
        });
    }
    create(channel, attachments) {
        return __awaiter(this, void 0, void 0, function* () {
            const embed = yield this.updateEmbed();
            let message;
            if (channel instanceof discord_js_1.CommandInteraction)
                message = (yield channel.reply({ embeds: [embed], components: [attachments], fetchReply: true }));
            else
                message = yield channel.send({ embeds: [embed], components: [attachments] });
            this.message_page[message.id] = 1;
            setTimeout(() => message.delete(), this.lifetime * 1000);
        });
    }
    next(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.message_page[messageId] == this.limit)
                throw Error("Page limit reached");
            this.message_page[messageId]++;
            return yield this.updateEmbed(messageId);
        });
    }
    previous(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.message_page[messageId] == 1)
                throw Error("Page limit reached");
            this.message_page[messageId]--;
            return yield this.updateEmbed(messageId);
        });
    }
}
exports.List = List;
