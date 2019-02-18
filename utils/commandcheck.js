/*
*   @Author     LOSDEV
*   @Contact    losdevpath@gmail.com
*   @Github     https://github.com/losdevpath/discord-bot
*   @License    https://github.com/losdevpath/discord-bot/blob/master/LICENSE
*/
const Discord = require("discord.js");
const config = require("../config.json");
const errors = require("../utils/errors.js");

module.exports = async (command, message) => {
    try {
        if(command.config.guild_only && message.channel.guild == undefined) {
            await errors.onlyGuild(message);
            return true;
        }
        if(command.config.permission == "admin" && !message.member.hasPermission("ADMINISTRATOR")) { 
            await errors.noPerms(message);
            return true;
        }
        if(command.config.permission == "staff" && !message.member.hasPermission("MANAGE_MESSAGES")) {
            await errors.noPerms(message);
            return true;
        }
        if(config.channel_commands_required == "true" && command.config.type == "command_channel") {
            if(message.channel.guild !== undefined) { 
                let chan = message.guild.channels.find(channel => channel.name === message.channel.name);
                if(chan.id !== config.channel_commands) {
                    let channel = message.guild.channels.get(config.channel_commands);
                    await errors.channelRequired(message, channel);
                    return true;
                }
            }
        }
    } catch(e) {
        console.log(e);
    }
}