/*
*   @Author     LOSDEV
*   @Contact    losdevpath@gmail.com
*   @Github     https://github.com/losdevpath/discord-bot
*   @License    https://github.com/losdevpath/discord-bot/blob/master/LICENSE
*/
const Discord = require("discord.js");
const request = require('request');
const steam_id = require('steamid');
const moment = require('moment');
const config = require("../config.json");
const botinfo = require("../botinfo.json");
const error = require("../utils/errors.js");
var steamCountries = require('../utils/steamcountries.min.json');

exports.execute = (bot, message, args) => {
  this_cmd = bot.commands.get("steam");
  let steam_userid;
  if (!args[1]) {
    steam_userid = message.author.username;
  } else {
    steam_userid = args[1];
  }
  /* SteamID64 Converter */
  request(
    {
      url: "http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=" + config.apikey_steam + "&vanityurl=" + steam_userid, 
      json: true
    }, function(error, response, body) {
    /* Check API Key*/
    if(response.statusCode == 403) {
      return error.noApiKey(message, "steam");
    }
    /* Steam ID Checker */
    if(/^\d+$/.test(steam_userid) && steam_userid.length == 17) {
      steamID64 = steam_userid;
    } else if(body.response.success == 1) {
      steamID64 = body.response.steamid;
    } else if((matches = steam_userid.match(/^STEAM_([0-5]):([0-1]):([0-9]+)$/)) || (matches = steam_userid.match(/^\[([a-zA-Z]):([0-5]):([0-9]+)(:[0-9]+)?\]$/))) {
      var SteamID3 = new SteamID(steam_userid);
      steamID64 = SteamID3.getSteamID64();
    } else {
      return message.channel.send(
        { embed: {
            author: {
              name: this_cmd.info.title,
              icon_url: this_cmd.config.image
            },
            color: this_cmd.config.color,
            description: `User ${steam_userid} not found. Possibly the user has not configured the url of his profile or has his private profile.`
          }
        }
      );
    }
    /* API URL's */
    var urls = [
      "http://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?key=" + config.apikey_steam + "&steamid=" + steamID64,
      "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" + config.apikey_steam + "&steamids=" + steamID64
    ];
    /* Steam user data */
    requestURL(urls, function(response) {
      user_data = {
        avatar: (JSON.parse(response[urls[1]].body).response.players[0].avatarfull),
        username: (JSON.parse(response[urls[1]].body).response.players[0].personaname),
        realname: (JSON.parse(response[urls[1]].body).response.players[0].realname),
        status : (JSON.parse(response[urls[1]].body).response.players[0].personastate),
        gameinfo : (JSON.parse(response[urls[1]].body).response.players[0].gameextrainfo),
        gameid : (JSON.parse(response[urls[1]].body).response.players[0].gameid),
        lobbysteamid : (JSON.parse(response[urls[1]].body).response.players[0].lobbysteamid),
        level : (JSON.parse(response[urls[0]].body).response.player_level),
        timecreated: (JSON.parse(response[urls[1]].body).response.players[0].timecreated),
        lastlogoff: (JSON.parse(response[urls[1]].body).response.players[0].lastlogoff),
        loccountrycode: (JSON.parse(response[urls[1]].body).response.players[0].loccountrycode),
        locstatecode: (JSON.parse(response[urls[1]].body).response.players[0].locstatecode),
        loccityid: (JSON.parse(response[urls[1]].body).response.players[0].loccityid),
      };
      embedProfile(message, user_data);
    });
  });
  /* Embed */
  function embedProfile (message, user_data) {
    let steam_embed = new Discord.RichEmbed();
    steam_embed.setAuthor(`${steam_userid} - Steam Profile Info`, this_cmd.config.image)
    steam_embed.setThumbnail(user_data.avatar);
    steam_embed.setColor("#114D7F");
    steam_embed.addField(`Nick`, user_data.username, true );
    steam_embed.addField(`Level`, user_data.level, true );
    /* Status codes */
    switch(user_data.status) {
      case 0:
        steam_embed.addField("Status", "Disconnected", true );
      break;
      case 1:
        steam_embed.addField("Status", "Online", true );
      break;
      case 2:
        steam_embed.addField("Status", "Busy", true );
      break;
      case 3:
        steam_embed.addField("Status", "AFK", true );
      break;
      case 4:
        steam_embed.addField("Status", "Sleeping", true );
      break;
      case 5:
        steam_embed.addField("Status", "Wishing to exchange", true );
      break;
      case 6:
        steam_embed.addField("Status", "Wishing to play", true );
      break;
    }
    /* Country code */
    if(user_data.loccountrycode !== undefined) {
      var loccountryname = steamCountries[user_data.loccountrycode].name;
      steam_embed.addField("Country", loccountryname, true );
    }
    /* City code */
    if(user_data.loccityid !== undefined) {
      var loccountrycode = user_data.loccountrycode;
      var locstatecode = user_data.locstatecode;
      var loccityid = user_data.loccityid;
      var loccityname = steamCountries[loccountrycode].states[locstatecode].cities[loccityid].name;
      steam_embed.addField("City", `${loccityname}`, true );
    }
    steam_embed.addField("Account created", moment(new Date(user_data.timecreated*1000)).format('DD/MM/YYYY'), true );
    steam_embed.addField("Last connection", moment(new Date(user_data.lastlogoff*1000)).format('DD/MM/YYYY, h:mm a'), true );
    if(user_data.gameinfo !== undefined) {
      steam_embed.addField("Playing", user_data.gameinfo);
      
    }
    steam_embed.addField("Profile", `[${steam_userid}](https://steamcommunity.com/id/${steam_userid})`, true);
    return message.channel.send(steam_embed);
  }
  function requestURL(urls, callback) {
    'use strict';
    var results = {}, t = urls.length, c = 0,
      handler = function (error, response, body) {
        var url = response.request.uri.href;
        results[url] = { error: error, response: response, body: body };
        if (++c === urls.length) { callback(results); }
      };
    while (t--) { request(urls[t], handler); }
  }
}

exports.config = {
  name: "steam",
  aliases: ["stm"],
  permission: "member",
  type: "command_channel",
  color: "1133951",
  image: "https://i.imgur.com/3LNiIBb.png",
  guild_only: true,
  enabled: true,
};

exports.info = {
  title: "Steam",
  description: "Profile info of steam.",
  usage: [
    `\`${config.bot_prefix}steam\` - Profile info of steam user.`,
    `\`${config.bot_prefix}steam (user)\` - Profile info of other steam user.`
  ]
};