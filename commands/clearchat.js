/*
*   @Author     LOSDEV
*   @Contact    losdevpath@gmail.com
*   @Github     https://github.com/losdevpath/discord-bot
*   @License    https://github.com/losdevpath/discord-bot/blob/master/LICENSE
*/
const Discord = require("discord.js");
const error = require("../utils/errors.js");
const config = require("../config.json");

exports.execute = (bot, message, args, con) => {
  this_cmd = bot.commands.get("clearchat");
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
  if(args[1] > 100 || args[1] < 1) {
    return message.author.send({embed:{title:"Clear Chat",description:`You must put a number between 1 and 100.`,color:this_cmd.config.color}});
  }
  message.channel.bulkDelete(args[1]).then(() => {
    message.channel.send({embed:{title:"Clear Chat",description:`Messages deleted!`,color:this_cmd.config.color}}).then(msg => msg.delete(5000));
  });
}

exports.config = {
  name: "clearchat",
  aliases: ["cc"],
  permission: "staff",
  type: "global",
  color: "5587653",
  image: "https://i.imgur.com/nfO6h2j.png",
  guild_only: true,
  enabled: true,
};

exports.info = {
  title: "Clear Chat",
  description: "Clear messages of the channel.",
  usage: [
    `\`${config.bot_prefix}clearchat (number)\` - Clear amount of messages in the channel.`
  ]
};