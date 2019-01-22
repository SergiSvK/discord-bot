/*
*   Discord Bot by LOSDEV
*   Website: losdev.es
*   Email: losdevpath@gmail.com
*/
const Discord = require("discord.js");
const botinfo = require("../version.json");

exports.execute = (bot, message, args) => {
    let embed = new Discord.RichEmbed()
    .setAuthor(botinfo.nombre, botinfo.imagen)
    .setColor("#ff0063")
    .setThumbnail(botinfo.imagen)
    /*.setDescription(botinfo.descripcion)*/
    .addField("Nombre", botinfo.nombre, true)
    .addField("Versión", botinfo.version, true)
    .addField("Autor", botinfo.autor, true)
    .addField("Contacto", botinfo.contacto, true);
    message.channel.send(embed);
}

exports.info = {
  name: "bot",
  alias: ["botinfo", "binfo"],
  permission: "default",
  type: "general",
  guildOnly: true,
  description: "Información del bot.",
  usage: "bot"
};
