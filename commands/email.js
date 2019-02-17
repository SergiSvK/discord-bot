/*
*   @Author     LOSDEV
*   @Contact    losdevpath@gmail.com
*   @Github     https://github.com/losdevpath/discord-bot
*   @License    https://github.com/losdevpath/discord-bot/blob/master/LICENSE
*/
const Discord = require("discord.js");
const mysql = require("mysql");
const config = require("../config.json");

exports.execute = (bot, message, args, con) => {
  this_cmd = bot.commands.get("email");
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
  let email = args[1];
  message.delete().catch();
  con.query(`SELECT * FROM users WHERE uid='${message.author.id}' AND server='${message.guild.id}'`, (err, rows) => {
    if(err) throw err;
    sql1 = `ALTER TABLE users ADD COLUMN IF NOT EXISTS \`email\` varchar(255) DEFAULT NULL`;
    con.query(sql1);
    sql2 = `UPDATE users SET email='${email}' WHERE uid='${message.author.id}' AND server='${message.guild.id}'`;
    con.query(sql2);
    return message.author.send(
      { embed: {
          author: {
            name: this_cmd.info.title,
            icon_url: this_cmd.config.image
          },
          color: this_cmd.config.color,
          description: `You have registered your email \`${email}\` correctly!`
        }
      }
    );
  });
}

exports.config = {
  name: "email",
  aliases: ["em"],
  permission: "member",
  type: "command_channel",
  color: "15724527",
  image: "https://i.imgur.com/coLdNEV.png",
  guild_only: true,
  enabled: true
};

exports.info = {
  title: "Email Register",
  description: "Register your email.",
  usage: [
    `\`${config.bot_prefix}email (mail@me.com)\` - Register your email.`
  ]
};