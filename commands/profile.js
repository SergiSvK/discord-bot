/*
*   @Author     LOSDEV
*   @Contact    losdevpath@gmail.com
*   @Github     https://github.com/losdevpath/discord-bot
*   @License    https://github.com/losdevpath/discord-bot/blob/master/LICENSE
*/
const Discord = require("discord.js");
const mysql = require("mysql");
const config = require("../config.json");
const error = require("../utils/errors.js");
const botinfo = require("../botinfo.json");

exports.execute = (bot, message, args, con) => {
  this_cmd = bot.commands.get("profile");
  let target = message.mentions.users.first() || message.guild.members.get(args[0]) || message.author;
  function memberProfile(rows, rank) {
    let level = rows[0].level;
    let money = rows[0].money;
    let uid = rows[0].uid;
    let invites = rows[0].invites;
    let suggestions = rows[0].suggestions;
    let reports = rows[0].reports;
    let messages = rows[0].messages;
    message.channel.send(
      { embed: {
          author: {
            name: `${target.username} | Profile`,
            icon_url: target.displayAvatarURL
          },
          color: this_cmd.config.color,
          thumbnail: {
            url: target.displayAvatarURL
          },
          fields: [
            {
              name: `Level`,
              value: `${level}`,
              inline: true
            },
            {
              name: `Rank`,
              value: `#${rank}`,
              inline: true
            },
            {
              name: `Money`,
              value: `${config.server_money_sign}${money}`,
              inline: true
            },
            {
              name: `Suggestions`,
              value: `${suggestions}`,
              inline: true
            },
            {
              name: `Reports`,
              value: `${reports}`,
              inline: true
            },
            {
              name: `Invitations`,
              value: `${invites}`,
              inline: true
            },
            {
              name: `Messages`,
              value: `${messages}`,
              inline: true
            },
            {
              name: `User ID`,
              value: `${uid}`,
              inline: true
            }
          ]
        }
      }
    );
  }
  con.query(`SELECT * FROM users WHERE uid='${target.id}' AND server='${message.guild.id}'`, (err, rows1) => {
    if(err) throw err;
    con.query("SET @rownum := 0");
    con.query(`SELECT rank FROM ( SELECT @rownum := @rownum + 1 AS rank, id FROM users ORDER BY level DESC ) AS result WHERE id=${rows1[0].id}`, (err, rows2) => {
      if(err) throw err;
      let rank = rows2[0].rank;
      memberProfile(rows1, rank);
      return;
    });
  });
}

exports.config = {
  name: "profile",
  aliases: ["p"],
  permission: "member",
  type: "command_channel",
  color: "5413344",
  image: "https://i.imgur.com/iRXnft7.png",
  guild_only: true,
  enabled: true,
};

exports.info = {
  title: "Profile",
  description: "View member profile.",
  usage: [
    `\`${config.bot_prefix}profile\` - View your profile.`,
    `\`${config.bot_prefix}profile @member\` - View member profile.`,
  ]
};