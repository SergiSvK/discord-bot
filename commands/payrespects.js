/*
*   @Author     LOSDEV
*   @Contact    losdevpath@gmail.com
*   @Github     https://github.com/losdevpath/discord-bot
*   @License    https://github.com/losdevpath/discord-bot/blob/master/LICENSE
*/
const Discord = require("discord.js");
const config = require("../config.json");
const lang = require(`../langs/${config.server_lang}.json`);

exports.execute = (bot, message, args, con) => {
  let this_cmd = bot.commands.get("payrespects");
  let now = new Date();
  let today = dateFormat(now, "dd");
  message.channel.send(
    { embed: {
        author: {
          name: `Pay Your Respects`,
          icon_url: this_cmd.config.image
        },
        color: this_cmd.config.color,
        description: `${message.author} has paid their respects.\n${today} Today, ${all} All`
      }
    }
  );
}

exports.config = {
  name: "payrespects",
  aliases: ["f"],
  permission: "member",
  type: "global",
  color: "16764527",
  image: "https://i.imgur.com/9CSX0Db.png",
  guild_only: true,
  enabled: true,
};

exports.info = {
  title: "Pay Your Respects",
  description: "Press 'F' to pay your respects.",
  usage: [
    `\`${config.bot_prefix}payrespects\` - Press 'F' to pay your respects.`
  ]
};