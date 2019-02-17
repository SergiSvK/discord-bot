/*
*   @Author     LOSDEV
*   @Contact    losdevpath@gmail.com
*   @Github     https://github.com/losdevpath/discord-bot
*   @License    https://github.com/losdevpath/discord-bot/blob/master/LICENSE
*/
const Discord = require("discord.js");
const mysql = require("mysql");
const dateFormat = require('dateformat');
const codegen = require('node-code-generator');
const config = require("../config.json");
const error = require("../utils/errors.js");
var now = new Date();

exports.execute = (bot, message, args, con) => {
  this_cmd = bot.commands.get("suggestion");
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
  function codeGenerator(num) {
    var gen = new codegen();
    var pattern = '######';
    var options = {};
    var code = gen.generateCodes(pattern, num, options);
    return code;
  }
  let code = codeGenerator(1);
  args.shift();
  let suggestion_message = args.join(" ");
  if(suggestion_message.length < 20) {
    return message.channel.send(
      { embed: {
          author: {
            name: this_cmd.info.title,
            icon_url: this_cmd.config.image
          },
          color: this_cmd.config.color,
          description: `Please, write more than 20 characters.`
        }
      }
    );
  }
  let suggestions_channel = message.guild.channels.find(channel => channel.id === config.channel_suggestions);
  if(!suggestions_channel) return error.channelNotSet(message, "suggestions");
  let date = dateFormat(now, config.server_date_format);
  message.delete().catch();
  suggestions_channel.send(
    { embed: {
        author: {
          name: `New Suggestion`,
          icon_url: this_cmd.config.image
        },
        color: this_cmd.config.color,
        fields: [
          {
            name: "Suggestion by",
            value: `${message.author}`,
            inline: true
          },
          {
            name: "Suggestion ID",
            value: `\`#${code}\``,
            inline: true
          },
          {
            name: "Date",
            value: `\`${date}\``,
            inline: true
          },
          {
            name: "Message",
            value: `\`\`\`${suggestion_message}\`\`\``
          }
        ]
      }
    }
  ).then(function (message){
    message.react("👍")
    .then(() => message.react('👎'));
  });
  message.author.send(
    { embed: {
        author: {
          name: this_cmd.info.title,
          icon_url: this_cmd.config.image
        },
        color: this_cmd.config.color,
        description: `Your suggestion has been sent! Thanks for your collaboration!`
      }
    }
  );
  con.query(`SELECT * FROM users WHERE uid='${message.author.id}' AND server='${message.guild.id}'`, (err, rows) =>{
    if(err) throw err;
    let sql;
    suggestions = rows[0].suggestions + 1;
    sql = `UPDATE users SET suggestions=${suggestions} WHERE uid='${message.author.id}' AND server='${message.guild.id}'`;
    con.query(sql);
    return;
  });
}

exports.config = {
  name: "suggestion",
  aliases: ["sug"],
  permission: "member",
  type: "suggestion_channel",
  color: "16765276",
  image: "https://i.imgur.com/DHtU4pI.png",
  guild_only: true,
  enabled: true,
};

exports.info = {
  title: "Suggestions",
  description: "Send a suggestion to server.",
  usage: [
    `\`${config.bot_prefix}suggestion (message)\` - Send a suggestion to server.`
  ]
};