/*
*   @Author     LOSDEV
*   @Contact    losdevpath@gmail.com
*   @Github     https://github.com/losdevpath/discord-bot
*   @License    https://github.com/losdevpath/discord-bot/blob/master/LICENSE
*/
const Discord = require("discord.js");
const config = require("../config.json");
const botinfo = require("../botinfo.json");
const lang = require(`../langs/${config.server_lang}.json`);

exports.execute = (bot, message, args, con) => {
  this_cmd = bot.commands.get("commands");
  if(!args[1]) {
    if(message.channel.type !== "dm") {
      message.channel.send(
        { embed: 
          { 
            author: {
              name: this_cmd.info.title,
              icon_url: this_cmd.config.image
            },
            description: "Command list sent to dm!",
            color:this_cmd.config.color
          }
        }
      );
    }
    let list = '';
    bot.commands.map( c => {
      list += `**${config.bot_prefix}${c.config.name}** - ${c.info.description}\n`
    });
    return message.author.send(
      { embed: {
          author: {
            name: `Command List`,
            icon_url: this_cmd.config.image
          },
          color: this_cmd.config.color,
          description: `This is a list of all commands. Some commands require special permissions to be used.\n\n${list}\nWrite \`${config.bot_prefix}${this_cmd.config.name} (command-name)\` to view more info.`
        }
      }
    );
  }
  let command = args[1];
  if(!bot.commands.has(command)) {
    return message.channel.send(
      { embed: 
        {
          author: {
            name: this_cmd.info.title,
            icon_url: this_cmd.config.image
          },
          description: `Command **${args[1]}** not found! To view all commands use **${config.bot_prefix}${this_cmd.config.name}**.`,
          color: this_cmd.config.color
        }
      }
    );
  }
  if(message.channel.type !== "dm") {
    message.channel.send(
      { embed: 
        { 
          author: {
            name: this_cmd.info.title,
            icon_url: this_cmd.config.image
          },
          description: "Command info sent to dm!",
          color: this_cmd.config.color
        }
      }
    );
  }
  cmd = bot.commands.get(command);
  return message.author.send(
    { embed: {
      author: {
        name: `${cmd.info.title}`,
        icon_url: cmd.config.image
      },
      color: cmd.config.color,
      description: `${cmd.info.description}\n`,
      fields: [
          {
            name: "Command",
            value: config.bot_prefix+cmd.config.name,
            inline: true
          },
          {
            name: "Aliases",
            value: `${cmd.config.aliases.join(', ')}`,
            inline: true
          },
          {
            name: "Permission",
            value: cmd.config.permission,
            inline: true
          },
          {
            name: "Usage",
            value: `${cmd.info.usage.join('\n')}`,
            inline: false
          }
        ]
      }
    }
  );
}

exports.config = {
  name: "commands",
  aliases: ["c"],
  permission: "member",
  type: "command_channel",
  color: "16761344",
  image: botinfo.bot_image,
  guild_only: false,
  enabled: true,
};

exports.info = {
  title: "Commands",
  description: "Show all command list.",
  usage: [
    `\`${config.bot_prefix}commands\` - View all commands.`, 
    `\`${config.bot_prefix}commands (command-name)\` - View info about command.`
  ]
};