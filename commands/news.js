/*
*   @Author     LOSDEV
*   @Contact    losdevpath@gmail.com
*   @Github     https://github.com/losdevpath/discord-bot
*   @License    https://github.com/losdevpath/discord-bot/blob/master/LICENSE
*/
const Discord = require("discord.js");
const config = require("../config.json");
const dateFormat = require('dateformat');
const errors = require("../utils/errors.js");

exports.execute = (bot, message, args, con) => {
  this_cmd = bot.commands.get("news");
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
  const newsMessage = args.join(" ").slice(args[0].length);
  message.delete().catch();
  let now = new Date();
  let date = dateFormat(now, config.server_date_format);
  message.channel.send(
    { embed: {
        author: {
          name: `${message.guild.name} - News`,
          icon_url: message.guild.iconURL
        },
        color: this_cmd.config.color,
        description: `${newsMessage}`,
        footer: {
          text: `${date}`
        }
      }
    }
  );
}

exports.config = {
  name: "news",
  aliases: ["nws"],
  permission: "admin",
  type: "global",
  color: "4229844",
  image: "https://i.imgur.com/nfO6h2j.png",
  guild_only: true,
  enabled: true,
};

exports.info = {
  title: "News",
  description: "Send news message to the channel.",
  usage: [
    `\`${config.bot_prefix}news (message)\` - Send news message to the channel.`
  ]
};