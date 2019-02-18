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
  this_cmd = bot.commands.get("say");
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
  const say_message = args.join(" ").slice(args[0].length);
  message.delete().catch();
  message.channel.send(say_message);
}

exports.config = {
  name: "say",
  aliases: ["sy"],
  permission: "admin",
  type: "global",
  color: config.bot_color,
  image: config.bot_avatar,
  guild_only: true,
  enabled: true,
};

exports.info = {
  title: "Say",
  description: "Make the bot write a message.",
  usage: [
    `\`${config.bot_prefix}say (message)\` - Write a message.`
  ]
};