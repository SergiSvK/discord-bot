/*
*   @Author     LOSDEV
*   @Contact    losdevpath@gmail.com
*   @Github     https://github.com/losdevpath/discord-bot
*   @License    https://github.com/losdevpath/discord-bot/blob/master/LICENSE
*/
const Discord = require("discord.js");
const config = require("../config.json");
const botinfo = require("../botinfo.json");
const errors = require("../utils/errors.js");
var music = require('../utils/music.js');

exports.execute = (bot, message, args, con) => {
  this_cmd = bot.commands.get("music");
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
  /* Check voice channel */
  if(!message.member.voiceChannel) {
    return message.channel.send(
      { embed: {
          author: {
            name: this_cmd.info.title,
            icon_url: this_cmd.config.image
          },
          color: this_cmd.config.color,
          description: `You must enter the music channel!`
        }
      }
    );
  }
  /* Check voice channel id */
  if(message.member.voiceChannel.id !== config.channel_music) {
    return message.channel.send(
      { embed: {
          author: {
            name: this_cmd.info.title,
            icon_url: this_cmd.config.image
          },
          color: this_cmd.config.color,
          description: `You must enter the music channel!`
        }
      }
    );
  }
  /* Add song */
  if(args[1] === "add") {
    let botUserId = bot.user.id;
    if(!message.member.voiceChannel.members.get(botUserId) && !message.member.voiceChannel.joinable) {
      return message.channel.send(
        { embed: {
            author: {
              name: this_cmd.info.title,
              icon_url: this_cmd.config.image
            },
            color: this_cmd.config.color,
            description: `I can not enter the music channel. Maybe it's full (?)`
          }
        }
      );
    }
    args.shift();
    args.shift();
    let searchString = args.join(" ");
    music.queueSong(message, searchString);
    return;
  }
  /* Play song */
  if(args[1] === "play") {
    music.playSong(message);
    return;
  }
  /* Pause song */
  if(args[1] === "pause") {
    return message.channel.send(
      { embed: {
          author: {
            name: this_cmd.info.title,
            icon_url: this_cmd.config.image
          },
          color: this_cmd.config.color,
          description: `**${message.author.username}** has paused the song.`
        }
      }
    ).then(function (message){
      music.pauseSong(message.guild.id);
    });
  }
  /* Stop and exit bot from channel */
  if(args[1] === "stop") {
    if(!message.member.hasPermission("MANAGE_MESSAGES")) {
      return message.channel.send(
        { embed: {
            author: {
              name: this_cmd.info.title,
              icon_url: this_cmd.config.image
            },
            color: this_cmd.config.color,
            description: `Only staff or DJ can be stop the music.`
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
          description: `**${message.author.username}** has stopped the music.`
        }
      }
    ).then(function (message){
      music.stopSong(message.guild.id);
    });
  }
  /* Skip song */
  if(args[1] === "skip") {
    return message.channel.send(
      { embed: {
          author: {
            name: this_cmd.info.title,
            icon_url: this_cmd.config.image
          },
          color: this_cmd.config.color,
          description: `**${message.author.username}** has passed to the next song.`
        }
      }
    ).then(function (message){
      music.skipSong(message.guild.id);
    });
  }
  /* Resume song */
  if(args[1] === "resume") {
    return message.channel.send(
      { embed: {
          author: {
            name: this_cmd.info.title,
            icon_url: this_cmd.config.image
          },
          color: this_cmd.config.color,
          description: `**${message.author.username}** has resume the song.`
        }
      }
    ).then(function (message){
      music.resumeSong(message.guild.id);
    });
  }
  /* List of songs */
  if(args[1] === "list") {
    music.playQueue(message, message.guild.id, message.channel);
  }
  /* Remove song */
  if(args[1] === "remove") {
    music.removeSong(message, message.guild.id, args[2]);
  }
}

exports.config = {
  name: "music",
  aliases: ["m"],
  permission: "member",
  type: "command_channel",
  color: "8181474",
  image: "https://i.imgur.com/WWcJyl0.png",
  guild_only: true,
  enabled: true,
};

exports.info = {
  title: "Music",
  description: "Listen youtube music on a voice channel.",
  usage: [
    `\`${config.bot_prefix}music add (title/url)\` - Add song to playlist.`,
    `\`${config.bot_prefix}music play\` - Play the playlist.`,
    `\`${config.bot_prefix}music list\` - Song list of playlist.`,
    `\`${config.bot_prefix}music pause\` - Pause actual song.`,
    `\`${config.bot_prefix}music resume\` - Resume song.`,
    `\`${config.bot_prefix}music stop\` - Stop and delete playlist.`,
    `\`${config.bot_prefix}music skip\` - Skip to the next song of playlist.`
  ]
};