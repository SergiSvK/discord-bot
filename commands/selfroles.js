/*
*   @Author     LOSDEV
*   @Contact    losdevpath@gmail.com
*   @Github     https://github.com/losdevpath/discord-bot
*   @License    https://github.com/losdevpath/discord-bot/blob/master/LICENSE
*/
const Discord = require("discord.js");
const fs = require("fs");
const config = require("../config.json");

exports.execute = (bot, message, args, con) => {
  message.delete().catch();
  let selfroles = fs.readFileSync("data/selfroles.json");
  let data = JSON.parse(selfroles);
  let num_roles = Object.keys(data.roles).length;
  message.channel.send({embed:{title:data.title,description:data.description,color:data.color}});
  for(var i = 0; i < num_roles; i++) {
    let title = data["roles"][i]["title"];
    let description = data["roles"][i]["description"];
    let color = data["roles"][i]["color"];
    message.channel.send({embed:{title:title,description:description,color:color}}).then(function (message) {
      message.react("✅")
    }).catch(() => console.log('Error with selfroles.'));
  }
}

exports.config = {
  name: "selfroles",
  aliases: ["sr"],
  permission: "admin",
  type: "global",
  color: "10447041",
  image: "https://i.imgur.com/nfO6h2j.png",
  guild_only: true,
  enabled: true,
};

exports.info = {
  title: "Self Roles",
  description: "Auto asignation of roles with reaction.",
  usage: [
    `\`${config.bot_prefix}selfroles\` - Send messages of self roles.`
  ]
};