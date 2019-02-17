/*
*   @Author     LOSDEV
*   @Contact    losdevpath@gmail.com
*   @Github     https://github.com/losdevpath/discord-bot
*   @License    https://github.com/losdevpath/discord-bot/blob/master/LICENSE
*/
const Discord = require("discord.js");
const error = require("../utils/errors.js");
const config = require("../config.json");

exports.execute = (bot, message, args, con) => {
  this_cmd = bot.commands.get("spoiler");
  /* Command info */
  if(!args[1]) {
    return message.channel.send(
      { embed: {
          author: {
            name: this_cmd.info.title,
            icon_url: this_cmd.config.image
          },
          color: this_cmd.config.color,
          description: `${this_cmd.info.description}\n\n${this_cmd.info.usage.join('\n')}`
        }
      }
    );
  }
  const spoiler = args.join(" ").slice(args[0].length);
  message.delete().catch();
  message.channel.send(
    {   embed: {
          author: {
            name: this_cmd.info.title,
            icon_url: this_cmd.config.image
          },
          color: this_cmd.config.color,
          description: `${message.author} sent a spoiler!\nIf you want to see the spoiler, click on the black mark.\n\n||${spoiler}||`
        }
    }
  );
}

exports.config = {
  name: "spoiler",
  aliases: ["sp"],
  permission: "member",
  type: "global",
  color: "14277081",
  image: "https://i.imgur.com/iRXnft7.png",
  guild_only: true,
  enabled: true
};

exports.info = {
  title: "Spoiler Alert!",
  description: "Send hidden message with spoiler alert.",
  usage: [
    `\`${config.bot_prefix}spoiler (message)\` - Send hidden message with spoiler alert.`
  ]
};