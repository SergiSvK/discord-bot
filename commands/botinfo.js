/*
*   @Author     LOSDEV
*   @Contact    losdevpath@gmail.com
*   @Github     https://github.com/losdevpath/discord-bot
*   @License    https://github.com/losdevpath/discord-bot/blob/master/LICENSE
*/
const Discord = require("discord.js");
const config = require("../config.json");
const botinfo = require("../botinfo.json");
const fs = require("fs");
const lang = require(`../langs/${config.server_lang}.json`);

exports.execute = (bot, message, args, con) => {
  message.channel.send(
    { embed: {
      author: {
        name: botinfo.bot_name,
        icon_url: botinfo.bot_image
      },
      color: config.bot_color,
      thumbnail: {
        url: botinfo.bot_image
      },
      description: botinfo.bot_description,
      fields: [
          {
            name: "Version",
            value: botinfo.bot_version,
            inline: true
          },
          {
            name: "Created by",
            value: `[${botinfo.bot_author}](${botinfo.bot_website})`,
            inline: true
          },
          {
            name: "Contact",
            value: botinfo.bot_contact,
            inline: true
          },
          {
            name: "Source code",
            value: `[GitHub.com](${botinfo.bot_github})`,
            inline: true
          }
        ]
      }
    }
  )
}

exports.config = {
  name: "botinfo",
  aliases: ["binfo"],
  permission: "member",
  type: "command_channel",
  color: "59343",
  image: "https://i.imgur.com/nfO6h2j.png",
  guild_only: false,
  enabled: true,
};

exports.info = {
  title: "Bot Information",
  description: "Information about the bot and author.",
  usage: [
    `\`${config.bot_prefix}botinfo\` - Bot information.`
  ]
};