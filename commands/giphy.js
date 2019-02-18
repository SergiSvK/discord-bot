/*
*   @Author     LOSDEV
*   @Contact    losdevpath@gmail.com
*   @Github     https://github.com/losdevpath/discord-bot
*   @License    https://github.com/losdevpath/discord-bot/blob/master/LICENSE
*/
const Discord = require("discord.js");
const config = require("../config.json");
const error = require("../utils/errors.js");
const giphy = require('giphy-api')(config.apikey_giphy);

exports.execute = (bot, message, args, con) => {
  let this_cmd = bot.commands.get("giphy");
  if(!config.apikey_giphy) {
    return error.noApiKey(message, "giphy");
  }
  if(!args[1]) {
    giphy.random().then(function (res) {
      return message.channel.send(
        { embed: {
            author: {
              name: `Random Gif - giphy.com`,
              icon_url: this_cmd.config.image
            },
            color: this_cmd.config.color,
            image: {
              url: res.data.images.original.url
            }
          }
        }
      );
    });
  } else {
    var gif_tag = args[1];
    giphy.random(gif_tag).then(function (res) {
      if(!res.data.images) {
        return error.gifsNotFound(message, gif_tag);
      } else {
        return message.channel.send(
          { embed: {
              author: {
                name: `Random Gif (${gif_tag}) - giphy.com`,
                icon_url: this_cmd.config.image
              },
              color: this_cmd.config.color,
              image: {
                url: res.data.images.original.url
              }
            }
          }
        );
      }
    });
  }
}

exports.config = {
  name: "giphy",
  aliases: ["gp", "gif"],
  permission: "member",
  type: "command_channel",
  color: "16737894",
  image: "https://i.imgur.com/NTG7tnV.png",
  guild_only: true,
  enabled: true,
};

exports.info = {
  title: "Random Gifs",
  description: "Show gifs from giphy.com.",
  usage: [
    `\`${config.bot_prefix}gyphy\` - Random gif from giphy.com.`,
    `\`${config.bot_prefix}gyphy (text)\` - Random gif from giphy.com.`
  ]
};