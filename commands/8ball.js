/*
*   @Author     LOSDEV
*   @Contact    losdevpath@gmail.com
*   @Github     https://github.com/losdevpath/discord-bot
*   @License    https://github.com/losdevpath/discord-bot/blob/master/LICENSE
*/
const Discord = require("discord.js");
const config = require("../config.json");
const lang = require(`../langs/${config.server_lang}.json`);
const responses = require("../data/8ball_"+config.server_lang+".json");

exports.execute = (bot, message, args, con) => {
  let this_cmd = bot.commands.get("8ball");
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
  let randomMessage = responses[Math.floor(Math.random() * responses.length)];
  const userQuestion = args.join(' ').slice(args[0].length);
  message.channel.send(
    { embed: {
      author: {
        name: `Magic Ball`,
        icon_url: this_cmd.config.image
      },
      color: this_cmd.config.color,
      thumbnail: {
        url: this_cmd.config.image
      },
      fields: [
          {
            name: `Question of ${message.author.username}`,
            value: userQuestion
          },
          {
            name: `The magic ball says...`,
            value: `${randomMessage}`
          }
        ]
      }
    }
  )
}

exports.config = {
  name: "8ball",
  aliases: ["8b"],
  permission: "member",
  type: "command_channel",
  color: "7062015",
  image: "https://i.imgur.com/1s6xECe.png",
  guild_only: true,
  enabled: true,
};

exports.info = {
  title: "Magic Ball",
  description: "Ask the magic ball a question.",
  usage: [
    `\`${config.bot_prefix}8ball (question)\` - Ask to the magic ball.`
  ]
};