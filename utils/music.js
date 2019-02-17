/*
*   @Author     LOSDEV
*   @Contact    losdevpath@gmail.com
*   @Github     https://github.com/losdevpath/discord-bot
*   @License    https://github.com/losdevpath/discord-bot/blob/master/LICENSE
*/
const Discord = require("discord.js");
const YTDL = require('ytdl-core');
const YTF = require('youtube-finder');
const config = require("../config.json");
const botinfo = require("../botinfo.json");
const error = require("../utils/errors.js");
const ytclient = YTF.createClient({key:config.apikey_google});
var guilds = {};

exports.queueSong = (message, searchString) => {
    let guildId = message.guild.id;
    if(!guilds[guildId]) guilds[guildId] = {
        playQueue: [],
        nowPlaying: null
    };
    var g = guilds[guildId];
    var params = {
        part: 'id',
        q: searchString,
        maxResults: 1,
        type: 'video'
    }
    if(!ytclient) {
        return error.noApiKey(message, "google");
    }
    ytclient.search(params, function(err, data) {
        if(err) throw err;
        if(data.items.length == 0) {
          return message.channel.send(
                { embed: 
                    {
                        author: {
                            name: `Music`,
                            icon_url: `https://i.imgur.com/WWcJyl0.png`
                        },
                        description:`There is no songs in the playlist.`,
                        color:8181474
                    }
                }
            );
        }
        var vidId = data.items[0].id.videoId;
        YTDL.getInfo(vidId, (err, info) => {
            var song = {
                id: vidId,
                title: vidId,
                length: info.length_seconds
            };
            g.playQueue.push(song);
            /* Song info */
            if(!err) song.title = info.title;
            let vid_url = "https://www.youtube.com/watch?v=" + song.id;
            let vid_min = ~~(song.length / 60);
            let vid_sec = ('0' + ~~(song.length % 60)).slice(0, 2);
            let vid_length = "`" + vid_min + ":" + vid_sec + "`";
            /* Send message to channel */
            message.channel.send(
                { embed:
                    {
                        author: {
                            name: `Music - New song added!`,
                            icon_url: `https://i.imgur.com/WWcJyl0.png`
                        },
                        description: `[${song.title}](${vid_url}) ${vid_length}`,
                        color: 8181474
                    }
                }
            );
        });
    });
};

function playSong(connection, guildId, message) {
    var g = guilds[guildId];
    if(g.playQueue[0]) {
        g.dispatcher = connection.playStream(YTDL(g.playQueue[0].id,{filter:"audioonly",quality:"highestaudio"}));
        g.nowPlaying = g.playQueue[0];
        g.playQueue.shift();
        g.dispatcher.on("end", end => {
          if(g.playQueue[0]) {
            playSong(connection, guildId);
          } else {
            connection.disconnect();
          }
        });
    } else {
        message.channel.send(
            {   embed: {
                    author: {
                    name: `Music - Songs not found`,
                    icon_url: `https://i.imgur.com/WWcJyl0.png`
                    },
                    color: 8181474,
                    description: `There is no songs on the playlist.`
                }
            }
        );
    }
}

exports.playSong = (message) => {
    var guildId = message.guild.id;
    var g = guilds[guildId];
    if(g) {
        if(!message.guild.voiceConnection) {
            message.member.voiceChannel.join().then((connection) => {
                message.channel.send(
                    {   embed: {
                            author: {
                            name: `Music - Play!`,
                            icon_url: `https://i.imgur.com/WWcJyl0.png`
                            },
                            color: 8181474,
                            description: `Playing playlist songs!`
                        }
                    }
                );
                playSong(connection, guildId, message);
            });
        }
    } else {
        message.channel.send(
            {   embed: {
                    author: {
                    name: `Music - Songs not found`,
                    icon_url: `https://i.imgur.com/WWcJyl0.png`
                    },
                    color: 8181474,
                    description: `There is no songs on the playlist.`
                }
            }
        );
    }
};

exports.pauseSong = (guildId) => {
    if(!guilds[guildId]) return;
    var g = guilds[guildId];
    if(g.dispatcher) g.dispatcher.pause();
};

exports.resumeSong = (guildId) => {
    if(!guilds[guildId]) return;
    var g = guilds[guildId];
    if(g.dispatcher) g.dispatcher.resume();
};

exports.skipSong = (guildId) => {
    if(!guilds[guildId]) return;
    var g = guilds[guildId];
    if(g.dispatcher) g.dispatcher.end();
};

exports.stopSong = (guildId) => {
    if(!guilds[guildId]) return;
    var g = guilds[guildId];
    g.playQueue = [];
    if(g.dispatcher) g.dispatcher.end();
};

exports.playQueue = (message, guildId, channel) => {
    if(!guilds[guildId]) return message.channel.send(
        { embed:
            {
                author: {
                    name: `Music - Playlist`,
                    icon_url: `https://i.imgur.com/WWcJyl0.png`
                },
                description: `There is no songs in the playlist.`,
                color: 8181474
            }
        }
    );
    var g = guilds[guildId];
    var q = "";
    var i = 1;
    let vid_url = "https://www.youtube.com/watch?v=";
    g.playQueue.forEach((song) => {
        let vid_url = "https://www.youtube.com/watch?v=" + song.id;
        let vid_min = ~~(song.length / 60);
        let vid_sec = ('0' + ~~(song.length % 60)).slice(0, 2);
        let vid_length = "`" + vid_min + ":" + vid_sec + "`";
        q += "`" + i++ + "`. ";
        q += `[${song.title}](${vid_url}) `;
        q += "`" + vid_length + "`\n";
    });
    /* Send playlist message */
    var embed = new Discord.RichEmbed();
    embed.setColor('#7CD6E2');
    embed.setAuthor(`Music - Playlist`, `https://i.imgur.com/WWcJyl0.png`);
    if(g.nowPlaying) {
        let curr_min = ~~(g.nowPlaying.length / 60);
        let curr_sec = ('0' + ~~(g.nowPlaying.length % 60)).slice(0, 2);
        let curr_length = "`" + curr_min + ":" + curr_sec + "`";
        var curr_song = `[${g.nowPlaying.title}](${vid_url+g.nowPlaying.id}) `;
        curr_song += "`" + curr_length + "`";
        embed.addField("**Playing Now**", curr_song);
    }
    if(q) {
      embed.addField("**In Queue**", q);
    }
    channel.send(embed);
}

exports.removeSong = (message, guildId, num) => {
    if(!guilds[guildId]) return;
    if(num < 1) return;
    var g = guilds[guildId];
    id = num - 1;
    g.playQueue.splice(id, 1);
    message.channel.send(
        {   embed: {
                author: {
                name: `Music - Song deleted!`,
                icon_url: `https://i.imgur.com/WWcJyl0.png`
                },
                color: 8181474,
                description: `**${message.author.username}** has delete song number **${num}**.`
            }
        }
    );
};