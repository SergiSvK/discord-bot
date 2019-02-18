/*
*   @Author     LOSDEV
*   @Contact    losdevpath@gmail.com
*   @Github     https://github.com/losdevpath/discord-bot
*   @License    https://github.com/losdevpath/discord-bot/blob/master/LICENSE
*/
const Discord = require("discord.js");
const config = require("../config.json");
const lang = require(`../langs/${config.server_lang}.json`);
const messages = require("../data/fortune_"+config.server_lang+".json");

exports.execute = (bot, message, args, con) => {
  let this_cmd = bot.commands.get("fortune");
  let random_message = messages[Math.floor(Math.random() * messages.length)];
  message.channel.send(`**${message.author.username}** has opened a fortune cookie!`);
  message.channel.send(
    { embed: {
        author: {
          name: `Fortune Cookie`,
          icon_url: this_cmd.config.image
        },
        color: 16764527,
        thumbnail: {
          url: this_cmd.config.image
        },
        description: random_message
      }
    }
  )
}

exports.config = {
  name: "fortune",
  aliases: ["f"],
  permission: "member",
  type: "command_channel",
  color: "16764527",
  image: "https://i.imgur.com/9CSX0Db.png",
  guild_only: true,
  enabled: true,
};

exports.info = {
  title: "Fortune Cookie",
  description: "Open a fortune cookie.",
  usage: [
    `\`${config.bot_prefix}fortune\` - Open a fortune cookie.`
  ]
};