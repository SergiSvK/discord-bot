/*
*   @Author     LOSDEV
*   @Contact    losdevpath@gmail.com
*   @Github     https://github.com/losdevpath/discord-bot
*   @License    https://github.com/losdevpath/discord-bot/blob/master/LICENSE
*/
const Discord = require("discord.js");
const dateFormat = require('dateformat');
const codegen = require('node-code-generator');
const config = require("../config.json");
const botinfo = require("../botinfo.json");
const mysql = require("mysql");
const error = require("../utils/errors.js");
const delay = ms => new Promise(res => setTimeout(res, ms));

exports.execute = async (bot, message, args, con) => {
  this_cmd = bot.commands.get("kick");
  /* Command info */
  if(!message.mentions.users.first()) {
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
  function codeGenerator(num) {
    var gen = new codegen();
    var pattern = '######';
    var options = {};
    var code = gen.generateCodes(pattern, num, options);
    return code;
  }
  /* Ban data */
  const now = new Date();
  let date = dateFormat(now, config.server_date_format);
  let code = codeGenerator(1);
  let user_kicked = message.mentions.users.first();
  let logs_channel = message.guild.channels.find(channel => channel.id === config.channel_logs);
  let activity_channel = message.guild.channels.find(channel => channel.id === config.channel_activity);
  if(!logs_channel) return error.channelNotSet(message, "logs");
  if(!activity_channel) return error.channelNotSet(message, "activity");
  args.shift();
  args.shift();
  let kick_reason = args.join(" ");
  /* Message to logs channel */
  await logs_channel.send(
    { embed: {
        author: {
          name: `New Kick - ID #${code}`,
          icon_url: this_cmd.config.image,
        },
        color: this_cmd.config.color,
        fields: [
          {
            name: "User Kicked",
            value: `${user_kicked}`,
            inline: true
          },
          {
            name: "Kicked by",
            value: `${message.author}`,
            inline: true
          },
          {
            name: "Date",
            value: `\`${date}\``,
            inline: true
          },
          {
            name: "Reason",
            value: `\`\`\`${kick_reason}\`\`\``
          }
        ]
      }
    }
  );
  /* Message to activity channel */
  await activity_channel.send(
    { embed: {
        author: {
          name: `New Member Kick`,
          icon_url: this_cmd.config.image,
        },
        color: this_cmd.config.color,
        fields: [
          {
            name: "User Kicked",
            value: `\`${user_kicked.username}\``,
            inline: true
          },
          {
            name: "Kicked by",
            value: `${message.author}`,
            inline: true
          },
          {
            name: "Date",
            value: `\`${date}\``,
            inline: true
          },
          {
            name: "Reason",
            value: `\`\`\`${kick_reason}\`\`\``
          }
        ]
      }
    }
  );
  /* Message to kicked user */
  await user_kicked.send(
    { embed: {
        author: {
          name: `You has been kicked!`,
          icon_url: this_cmd.config.image,
        },
        description: `You has been kicked from **${message.guild.name}**.`,
        color: this_cmd.config.color,
        fields: [
          {
            name: "Kicked by",
            value: `${message.author}`,
            inline: true
          },
          {
            name: "Kick ID",
            value: `\`#${code}\``,
            inline: true
          },
          {
            name: "Date",
            value: `\`${date}\``,
            inline: true
          },
          {
            name: "Reason",
            value: `\`\`\`${kick_reason}\`\`\``
          }
        ]
      }
    }
  );
  message.delete().catch();
  delay(300);
  let member_kick = message.guild.member(user_kicked);
  member_kick.ban(kick_reason)
  .then(() => console.log(`User ${member_ban.displayName} has been kicked. (#${code})`))
  .catch(console.error);
}

exports.config = {
  name: "kick",
  aliases: ["kk"],
  permission: "staff",
  type: "global",
  color: "16312424",
  image: "https://i.imgur.com/AOXyUy1.png",
  guild_only: true,
  enabled: true,
};

exports.info = {
  title: "Kick",
  description: "Kick member.",
  usage: [
    `\`${config.bot_prefix}kick @member (reason)\` - Kick member.`
  ]
};