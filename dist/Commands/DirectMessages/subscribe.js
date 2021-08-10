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
exports.command = void 0;
exports.command = {
    name: 'subscribe',
    description: "subscribe for personal events notifications",
    aliases: ['sub'],
    options: [{ name: 'title', required: true }],
    run: (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (args.length > 1)
            return;
        try {
            const title = args[0];
            const profile = yield client.database.getPlayer(message.author.id);
            if (!profile)
                throw Error("This user did not join events.");
            const tags = yield profile.subscriptions;
            console.log(tags);
            if (tags.find(tag => tag.title == title))
                throw Error("You are already subscribed for this tag");
            var tag = (_a = yield client.database.getTag(title)) !== null && _a !== void 0 ? _a : client.database.tag({ title: title });
            yield client.database.addTag(tag);
            tags.push(tag);
            profile.subscriptions = Promise.resolve(tags);
            console.log("updating");
            yield client.database.updatePlayer(profile);
        }
        catch (error) {
            message.channel.send(error);
        }
    })
};
