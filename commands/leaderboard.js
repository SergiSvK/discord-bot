/*
*   @Author     LOSDEV
*   @Contact    losdevpath@gmail.com
*   @Github     https://github.com/losdevpath/discord-bot
*   @License    https://github.com/losdevpath/discord-bot/blob/master/LICENSE
*/
const Discord = require("discord.js");
const mysql = require("mysql");
const config = require("../config.json");
const botinfo = require("../botinfo.json");

exports.execute = (bot, message, args, con) => {
  let this_cmd = bot.commands.get("leaderboard");
  function leaderboards(rows, type) {
    let list = '';
    let title = '';
    if(type == "messages") {
      title = "Messages";
      for(i=0;i<rows.length;i++) {
        let member = message.guild.members.get(rows[i].uid);
        num = i+1;
        list += `**${num}**. ${member} - ${rows[i].messages} Messages\n`;
      }
    }
    if(type == "level") {
      title = "Level";
      for(i=0;i<rows.length;i++) {
        let member = message.guild.members.get(rows[i].uid);
        num = i+1;
        list += `**${num}**. ${member} - Level ${rows[i].level}\n`;
      }
    }
    if(type == "invitations") {
      title = "Invitations";
      for(i=0;i<rows.length;i++) {
        let member = message.guild.members.get(rows[i].uid);
        num = i+1;
        list += `**${num}**. ${member} - ${rows[i].invites} Invitations\n`;
      }
    }
    message.channel.send(
      { embed: {
          author: {
            name: `${title} | Leaderboard`,
            icon_url: this_cmd.config.image
          },
          color: this_cmd.config.color,
          description: `${list}`,
        }
      }
    );
  }
  let limit = 10;
  con.query("SET @rownum := 0");
  con.query(`SELECT rank, level, server, uid FROM ( SELECT @rownum := @rownum + 1 AS rank, level, server, uid FROM users ORDER BY level DESC ) AS result WHERE server=${message.guild.id} LIMIT ${limit}`, (err, rows) => {
    if(err) throw err;
    leaderboards(rows, "level");
  });
  con.query(`SELECT rank, messages, server, uid FROM ( SELECT @rownum := @rownum + 1 AS rank, messages, server, uid FROM users ORDER BY messages DESC ) AS result WHERE server=${message.guild.id} LIMIT ${limit}`, (err, rows) => {
    if(err) throw err;
    leaderboards(rows, "messages");
  });
  con.query(`SELECT rank, invites, server, uid FROM ( SELECT @rownum := @rownum + 1 AS rank, invites, server, uid FROM users ORDER BY invites DESC ) AS result WHERE server=${message.guild.id} LIMIT ${limit}`, (err, rows) => {
    if(err) throw err;
    leaderboards(rows, "invitations");
  });
}

exports.config = {
  name: "leaderboard",
  aliases: ["lb", "top"],
  permission: "member",
  type: "command_channel",
  color: "15819455",
  image: "https://i.imgur.com/im0aSJn.png",
  guild_only: true,
  enabled: true,
};

exports.info = {
  title: "Leaderboards",
  description: "Show top 10 leaderboards.",
  usage: [
    `\`${config.bot_prefix}leaderboard\` - Show leaderboards.`
  ]
};