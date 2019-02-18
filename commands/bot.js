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
  this_cmd = bot.commands.get("bot");
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
  if(args[1]) {
    if(!message.member.hasPermission("ADMINISTRATOR")) { errors.noPerms(message); return; }
    if(args[1] == "avatar") {
      message.delete().catch();
      let avatar = args[2];
      bot.user.setAvatar(avatar);
      var config_file = '../config.json';
      var file = require(config_file);
      file.bot_avatar = avatar;
      fs.writeFile(config_file, JSON.stringify(file, null, 2), function (err) {
        if (err) return console.log(err);
        console.log(JSON.stringify(file));
      });
      message.channel.send(
        { embed: {
            author: {
              name: `Bot Avatar`,
              icon_url: `https://i.imgur.com/nfO6h2j.png`
            },
            description: `Bot avatar set to:`,
            color: 8729855,
            image: {
              url: avatar
            }
          }
        }
      );
    }
    if(args[1] == "activity") {
      if(!args[2] || !args[3]) return;
      let type;
      let content = args[3];
      if(args[2] == "1") { type = "WATCHING";}
      if(args[2] == "2") { type = "PLAYING";}
      if(args[2] == "3") { type = "STREAMING";}
      if(args[2] == "4") { type = "LISTENING";}
      bot.user.setActivity(content,{type:type});
      var config_file = '../config.json';
      var file = require(config_file);
      file.bot_activity_type = type;
      file.bot_activity_content = content;
      fs.writeFile(config_file, JSON.stringify(file, null, 2), function (err) {
        if (err) return console.log(err);
        console.log(JSON.stringify(file));
      });
    }
  }
}

exports.config = {
  name: "bot",
  aliases: ["bt"],
  permission: "member",
  type: "command_channel",
  color: "59343",
  image: "https://i.imgur.com/nfO6h2j.png",
  guild_only: false,
  enabled: true,
};

exports.info = {
  title: "Bot Information",
  description: "Modify bot options.",
  usage: [
    `\`${config.bot_prefix}bot avatar (url)\` - Change bot avatar.`,
    `\`${config.bot_prefix}bot activity (1/2/3/4) (message)\` - Change bot activity.`,
  ]
};