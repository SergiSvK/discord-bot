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
  let this_cmd = bot.commands.get("level");
  /* Experience Generator */
  function expGen(level) {
    let max = level * 30;
    let min = level * 20;
    return Math.floor(Math.random() * (max - min) ) + min;
  }
  /* Member level */
  function memberLevel(rows, rank) {
    /* db data */
    let db_level = rows[0].level;
    let db_exp = rows[0].exp;
    /* Multiplier next level */
    let multiplier = 30;
    let level_mult = 5;
    if(db_level >= 10) { multiplier = 50; level_mult = 10; }
    if(db_level >= 20) { multiplier = 70; level_mult = 15; }
    if(db_level >= 30) { multiplier = 90; level_mult = 20; }
    if(db_level >= 40) { multiplier = 110; level_mult = 25; }
    if(db_level >= 50) { multiplier = 130; level_mult = 30; }
    if(db_level >= 60) { multiplier = 150; level_mult = 35; }
    if(db_level >= 70) { multiplier = 170; level_mult = 40; }
    if(db_level >= 80) { multiplier = 190; level_mult = 45; }
    if(db_level >= 90) { multiplier = 210; level_mult = 50; }
    if(db_level >= 100) { multiplier = 230; level_mult = 55; }
    let exp_to_next_level = multiplier * (db_level * level_mult);
    let dif_exp = exp_to_next_level - db_exp;
    message.channel.send(
      { embed: {
          author: {
            name: `${message.author.username} | Level`,
            icon_url: this_cmd.config.image
          },
          color: this_cmd.config.color,
          thumbnail: {
            url: `https://i.imgur.com/mrxA1w4.png`
          },
          fields: [
            {
              name: `Level`,
              value: `${db_level}`,
              inline: true
            },
            {
              name: `Rank`,
              value: `#${rank}`,
              inline: true
            },
            {
              name: `Experience`,
              value: `${db_exp}/${exp_to_next_level}xp`,
              inline: true
            },
            {
              name: `Exp to next level`,
              value: `${dif_exp}xp`,
              inline: true
            }
          ]
        }
      }
    );
  }
  con.query(`SELECT * FROM users WHERE uid='${message.author.id}' and server='${message.guild.id}'`, (err, rows1) => {
    if(err) throw err;
    con.query("SET @rownum := 0");
    con.query(`SELECT rank, level FROM ( SELECT @rownum := @rownum + 1 AS rank, level, id FROM users ORDER BY level DESC ) AS result WHERE id=${rows1[0].id}`, (err, rows2) => {
      if(err) throw err;
      let rank = rows2[0].rank;
      memberLevel(rows1, rank);
    });
  });
}

exports.config = {
  name: "level",
  aliases: ["lvl"],
  permission: "member",
  type: "command_channel",
  color: "8729855",
  image: "https://i.imgur.com/QdZhjdc.png",
  guild_only: true,
  enabled: true,
};

exports.info = {
  title: "Level",
  description: "Show level and experience.",
  usage: [
    `\`${config.bot_prefix}level\` - Show level and experience.`
  ]
};