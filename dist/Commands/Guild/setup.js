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
function validate_channel(channelID, guild) {
    const channel = guild.channels.cache.get(channelID);
    if (channel == undefined)
        return "Cannot find the channel";
    return channel;
}
function validate_category(categoryID, guild) {
    const category = guild.channels.cache.get(categoryID);
    if (category == undefined)
        return "Cannot find the category";
    return category;
}
exports.command = {
    name: 'setup',
    aliases: ['s'],
    run: (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
        const guild = message.guild;
        if (guild == null)
            return;
        if (args.length != 2)
            message.channel.send("The format of request is **channelId sectionId**");
        const channel = validate_channel(args[0], guild);
        const category = validate_category(args[1], guild);
        if (typeof channel == "string")
            message.channel.send(channel);
        else if (typeof category == "string")
            message.channel.send(category);
        else if (category.children.find(channel => channel.id == channel.id)) {
            const result = yield client.database.updateServer(guild.id, {
                eventChannel: channel.id,
                eventCategory: category.id
            });
            if (result)
                yield message.channel.send("channel and category successfuly binded.");
            else
                yield message.channel.send("something went wrong");
        }
        else
            yield message.channel.send(`Channel ${channel.name} is not in ${category.name} category.`);
    })
};
