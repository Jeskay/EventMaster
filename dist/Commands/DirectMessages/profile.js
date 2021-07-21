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
    name: 'profile',
    description: "print user statistics",
    aliases: ['info'],
    options: [{ name: 'user', required: false }],
    run: (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
        if (args.length > 1)
            return;
        try {
            let userId = args[0];
            if (args.length == 0)
                userId = message.author.id;
            else if (message.guild)
                userId = client.helper.extractID(args[0]);
            const profile = yield client.database.getPlayer(userId);
            if (!profile)
                throw Error("This user did not join events.");
            const user = yield client.users.cache.get(userId);
            if (!user)
                throw Error("User does not exists.");
            const commends = yield profile.commendsAbout;
            yield message.channel.send(client.embeds.playerInfo(profile, user, commends));
        }
        catch (error) {
            message.channel.send(error);
        }
    })
};
