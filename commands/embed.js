/*
*   @Author     LOSDEV
*   @Contact    losdevpath@gmail.com
*   @Github     https://github.com/losdevpath/discord-bot
*   @License    https://github.com/losdevpath/discord-bot/blob/master/LICENSE
*/
const Discord = require("discord.js");
const errors = require("../utils/errors.js");
const config = require("../config.json");

exports.execute = (bot, message, args, con) => {
  let this_cmd = bot.commands.get("embed");
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
  const embed_message = args.join(" ").slice(args[0].length);
  message.delete().catch();
  message.channel.send(
    { embed: 
      { 
        description: embed_message,
        color: this_cmd.config.color
      }
    }
  );
}

exports.config = {
  name: "embed",
  aliases: ["eb"],
  permission: "staff",
  type: "global",
  color: "14263645",
  image: "https://i.imgur.com/nfO6h2j.png",
  guild_only: true,
  enabled: true,
};

exports.info = {
  title: "Embed Message",
  description: "Create a embed message.",
  usage: [
    `\`${config.bot_prefix}embed (message)\` - Create a embed message.`
  ]
};