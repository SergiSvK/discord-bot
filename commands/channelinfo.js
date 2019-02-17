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
const errors = require("../utils/errors.js");

exports.execute = (bot, message, args, con) => {
  this_cmd = bot.commands.get("channelinfo");
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
  const types = {
  	dm: 'DM',
  	group: 'Group',
  	text: 'Text Channel',
  	voice: 'Voice Channel',
  	category: 'Category',
  	unknown: 'Unknown'
  };
  let chan = message.guild.channels.find(channel => channel.name === args[1]);
  if(!chan) return errors.channelNotFound(message, args);
  let date = dateFormat(chan.createdAt, config.server_date_format);
  message.channel.send(
    { embed: {
      author: {
        name: `${chan.name} | Channel Info`
      },
      color: this_cmd.config.color,
      fields: [
          {
            name: "Channel",
            value: chan.name,
            inline: true
          },
          {
            name: "ID",
            value: chan.id,
            inline: true
          },
          {
            name: "NSFW",
            value: chan.nsfw ? 'Yes' : 'No',
            inline: true
          },
          {
            name: "Category",
            value: chan.parent ? chan.parent.name : 'Without category',
            inline: true
          },
          {
            name: "Type",
            value: types[chan.type],
            inline: true
          },
          {
            name: "Created",
            value: date,
            inline: true
          },
          {
            name: "Description",
            value: chan.topic || 'Without description',
            inline: true
          }
        ]
      }
    }
  )
}

exports.config = {
  name: "channelinfo",
  aliases: ["cinfo"],
  permission: "member",
  type: "command_channel",
  color: "15520864",
  image: "https://i.imgur.com/nfO6h2j.png",
  guild_only: true,
  enabled: true,
};

exports.info = {
  title: "Channel Information",
  description: "Information about the channel.",
  usage: [
    `\`${config.bot_prefix}channelinfo (channel-name)\` - Information about the channel.`
  ]
};