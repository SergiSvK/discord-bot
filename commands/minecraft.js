/*
*   @Author     LOSDEV
*   @Contact    losdevpath@gmail.com
*   @Github     https://github.com/losdevpath/discord-bot
*   @License    https://github.com/losdevpath/discord-bot/blob/master/LICENSE
*/
const Discord = require("discord.js");
const request = require('request');
const config = require("../config.json");
const botinfo = require("../botinfo.json");
const error = require("../utils/errors.js");

exports.execute = (bot, message, args, con) => {
  this_cmd = bot.commands.get("minecraft");
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
  /* Command data */
  let api_url = "https://api.mcsrvstat.us/1/";
  let server_ip = args[1];
  let url = api_url + server_ip;
  request(url, function(err, response, body) {
    if(err) {
      console.error(err);
      return message.channel.send(
        { embed: {
            author: {
              name: this_cmd.info.title,
              icon_url: this_cmd.config.image
            },
            color: this_cmd.config.color,
            description: `An error has occurred. Check the server ip you have provided.`
          }
        }
      );
    }
    body = JSON.parse(body);
    let status = body.debug["ping"];
    if(status) {
      let online = body.debug["ping"];
      let server_status;
      if(online) { 
        server_status = "Online" 
      } else { 
        server_status = "Offline" 
      };
      let server_players = body.players["online"];
      let server_motd1 = body.motd["clean"]["0"];
      let server_motd2 = body.motd["clean"]["1"];
      let server_version = body.version;
      let server_ip = body.hostname;
      let server_image = `https://eu.mc-api.net/v3/server/favicon/${server_ip}`;
      return message.channel.send(
        { embed: {
            author: {
              name: `${server_ip} - ${this_cmd.info.title}`,
              icon_url: server_image
            },
            color: this_cmd.config.color,
            description: `${server_motd1}\n${server_motd2}`,
            fields: [
              {
                name: "Status",
                value: server_status,
                inline: true
              },
              {
                name: "Players Online",
                value: server_players,
                inline: true
              },
              {
                name: "IP",
                value: server_ip,
                inline: true
              },
              {
                name: "Minecraft Version",
                value: server_version,
                inline: true
              }
            ]
          }
        }
      );
    }
    return message.channel.send(
      { embed: {
          author: {
            name: this_cmd.info.title,
            icon_url: this_cmd.config.image
          },
          color: this_cmd.config.color,
          description: `The server you have provided does not respond, is offline or is not registered.`
        }
      }
    );
  });
}

exports.config = {
  name: "minecraft",
  aliases: ["mc"],
  permission: "member",
  type: "command_channel",
  color: "10473314",
  image: "https://i.imgur.com/REo1K0C.png",
  guild_only: true,
  enabled: true,
};

exports.info = {
  title: "Minecraft Server Info",
  description: "View info about minecraft server.",
  usage: [
    `\`${config.bot_prefix}minecraft (server-ip)\` - View info about minecraft server.`
  ]
};