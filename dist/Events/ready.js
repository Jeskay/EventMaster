"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
exports.event = {
    name: 'ready',
    run: (client) => {
        if (client.user == null)
            console.log("User is null, please check bot token.");
        else
            console.log(`${client.user.tag} is online`);
    }
};
