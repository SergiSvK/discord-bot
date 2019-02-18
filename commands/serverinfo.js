/*
*   @Author     LOSDEV
*   @Contact    losdevpath@gmail.com
*   @Github     https://github.com/losdevpath/discord-bot
*   @License    https://github.com/losdevpath/discord-bot/blob/master/LICENSE
*/
const Discord = require("discord.js");
const dateFormat = require('dateformat');
const config = require("../config.json");
const botinfo = require("../botinfo.json");

exports.execute = (bot, message, args) => {
  let date = dateFormat(message.guild.owner.joinedTimestamp, config.server_date_format);
  message.channel.send(
    { embed: {
        author: {
          name: `${message.guild.name} | Information`,
          icon_url: `${message.guild.iconURL ? message.guild.iconURL : ""}`
        },
        description: config.server_description,
        color: config.bot_color,
        thumbnail: {
          url: `${message.guild.iconURL ? message.guild.iconURL : ""}`
        },
        fields: [
          {
            name: `Name`,
            value: `${message.guild.name}`,
            inline: true
          },
          {
            name: `Region`,
            value: `${message.guild.region}`,
            inline: true
          },
          {
            name: `ID`,
            value: `${message.guild.id}`,
            inline: true
          },
          {
            name: `Created at`,
            value: `${date}`,
            inline: true
          },
          {
            name: `Owner`,
            value: `${message.guild.owner.user.username}#${message.guild.owner.user.discriminator}`,
            inline: true
          },
          {
            name: `Members`,
            value: `${message.guild.members.filter(mb => mb.user.bot === false).size}`,
            inline: true
          },
          {
            name: `Bots`,
            value: `${message.guild.members.filter(mb => mb.user.bot === true).size}`,
            inline: true
          },
          {
            name: `Roles`,
            value: `${message.guild.roles.size}`,
            inline: true
          },
          {
            name: `Text channels`,
            value: `${message.guild.channels.filter(c => c.type === "text").size}`,
            inline: true
          },
          {
            name: `Voice channels`,
            value: `${message.guild.channels.filter(c => c.type === "voice").size}`,
            inline: true
          },
          {
            name: `Emojis`,
            value: `${message.guild.emojis.size}`,
            inline: true
          },
          {
            name: `Ping`,
            value: `${bot.ping.toFixed(0)}ms`,
            inline: true
          },
          {
            name: `Uptime`,
            value: `${~~(bot.uptime/1000)}s`,
            inline: true
          }
        ]
      }
    }
  );
}

exports.config = {
  name: "serverinfo",
  aliases: ["sinfo"],
  permission: "member",
  type: "command_channel",
  color: "8729855",
  image: "https://i.imgur.com/nfO6h2j.png",
  guild_only: true,
  enabled: true,
};

exports.info = {
  title: "Server Info",
  description: "Show information about the server.",
  usage: [
    `\`${config.bot_prefix}serverinfo\` - Show information about the server.`
  ]
};