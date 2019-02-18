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
const now = new Date();

exports.execute = (bot, message, args, con) => {
  this_cmd = bot.commands.get("report");
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
  /* Report data */
  let date = dateFormat(now, config.server_date_format);
  let code = codeGenerator(1);
  let user_reported = message.mentions.users.first();
  let report_channel = message.guild.channels.find(channel => channel.id === config.channel_reports);
  if(!report_channel) return error.channelNotSet(message, "reports");
  args.shift();
  args.shift();
  let report_reason = args.join(" ");
  message.delete().catch();
  /* Message to reports channel */
  report_channel.send(
    { embed: {
        author: {
          name: `New Report - #${code}`,
          icon_url: `https://i.imgur.com/TbjO54r.png`
        },
        color: this_cmd.config.color,
        fields: [
          {
            name: "Reported User",
            value: `${user_reported}`,
            inline: true
          },
          {
            name: "Reported by",
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
            value: `\`\`\`${report_reason}\`\`\``
          }
        ]
      }
    }
  );
  /* Message to author */
  message.author.send(
    { embed: {
        author: {
          name: `Report sent to staff!`,
          icon_url: `https://i.imgur.com/TbjO54r.png`
        },
        description: `Your report has been sent to staff. This is a copy of your report. The staff will contact you to obtain more information if necessary. Report code: \`#${code}\``,
        color: this_cmd.config.color,
        fields: [
          {
            name: "Reported User",
            value: `${user_reported}`,
            inline: true
          },
          {
            name: "Report ID",
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
            value: `\`\`\`${report_reason}\`\`\``
          }
        ]
      }
    }
  );
  con.query(`SELECT * FROM users WHERE uid='${user_reported.id}' AND server='${message.guild.id}'`, (err, rows) =>{
    if(err) throw err;
    let sql;
    reports = rows[0].reports + 1;
    sql = `UPDATE users SET reports=${reports} WHERE uid='${user_reported.id}' AND server='${message.guild.id}'`;
    con.query(sql);
    return;
  });
}

exports.config = {
  name: "report",
  aliases: ["rep"],
  permission: "member",
  type: "command_channel",
  color: "14833484",
  image: "https://i.imgur.com/XOjySNh.png",
  guild_only: true,
  enabled: true,
};

exports.info = {
  title: "Reports",
  description: "Report a member.",
  usage: [
    `\`${config.bot_prefix}report @member (reason)\` - Report a member.`
  ]
};