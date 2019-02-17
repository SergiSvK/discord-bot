/*
*   @Author     LOSDEV
*   @Contact    losdevpath@gmail.com
*   @Github     https://github.com/losdevpath/discord-bot
*   @License    https://github.com/losdevpath/discord-bot/blob/master/LICENSE
*/
const Discord = require("discord.js");
const https = require('https');
const config = require("../config.json");
const lang = require(`../langs/${config.server_lang}.json`);

exports.execute = (bot, message, args, con) => {
  let this_cmd = bot.commands.get("4chan");
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
  const boards = [
    "a", "b", "c", "d", "e", "f", "g", "gif", "h", "hr", "k", "m", "o", "p", "r", "s", "t", "u", "v", "vg", "vr", "w", "wg", "i", "ic", "r9k", "s4s", "vip", "qa", "cm", "hm", "lgbt", "y", "3", "aco", "adv", "an", "asp", "bant", "biz", "cgl", "ck", "co", "diy", "fa", "fit", "gd", "hc", "his", "int", "jp", "lit", "mlp", "mu", "n", "news", "out", "po", "pol", "qst", "sci", "soc", "sp", "tg", "toy", "trv", "tv", "vp", "wsg", "wsr"
  ];
  if(args.length == 2) {
    if(args[1] === "list") {
      var msg = "";
      for(var i = 0; i < boards.length; i++) {
        msg += boards[i] + ", ";
      }
      msg = msg.substring(0, msg.length - 2);
      return message.channel.send(
      { embed: {
          author: {
            name: `4chan.org board list`,
            icon_url: this_cmd.config.image
          },
          color: this_cmd.config.color,
          description: msg
        }
      });
    }
  }
  var board = args[1];
  if(boards.indexOf(board) == -1) return message.channel.send({embed:{color:26112,description:`That board not exist! ${config.bot_prefix}4chan list`}});
  var page = Math.floor((Math.random() * 10) + 1);
  var url = "https://a.4cdn.org/" + board + "/" + page + ".json"
  https.get(url, res => {
    res.setEncoding('utf8');
    let body = "";
    res.on("data", data => {
        body += data;
    });
    res.on("end", end => {
      body = JSON.parse(body);
      var postNr = Math.floor(Math.random() * body.threads.length);
      var imgId = body.threads[postNr].posts[0].tim;
      var imgExt = body.threads[postNr].posts[0].ext;
      var com = body.threads[postNr].posts[0].com;
      if(com == null) {
        com = "";
      } else {
        com = com.replace(/<br>/g, "\n");
        com = com.replace(/<span class=\"quote\">&gt;/g, ">");
        com = com.replace(/<\/span>/g, "");
        com = com.replace(/&quot/g, '"');
        com = com.replace(/&#039;/g, "'");
        com = com.substring(0, 255);
      }
      var thread = "http://boards.4chan.org/"+ board +"/thread/";
      thread += body.threads[postNr].posts[0].no;
      var imgUrl = "http://i.4cdn.org/" + board + "/";
      imgUrl += imgId + "" + imgExt;

      return message.channel.send(
        { embed: {
            author: {
              name: `Random image from /${board}/ - 4chan.org`,
              icon_url: this_cmd.config.image
            },
            image: {
              url: imgUrl
            },
            color: this_cmd.config.color,
            url: thread,
            title: com
          }
        });
    });
  });
}

exports.config = {
  name: "4chan",
  aliases: ["4c"],
  permission: "member",
  type: "command_channel",
  color: "26112",
  image: "https://i.imgur.com/cygTvKG.png",
  guild_only: true,
  enabled: true,
};

exports.info = {
  title: "4chan Random Images",
  description: "Show random image from 4chan.org.",
  usage: [
    `\`${config.bot_prefix}4chan list\` - View all board list.`, 
    `\`${config.bot_prefix}4chan (board)\` - Random image from board.`
  ]
};