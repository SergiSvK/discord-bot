/*
*   @Author     LOSDEV
*   @Contact    losdevpath@gmail.com
*   @Github     https://github.com/losdevpath/discord-bot
*   @License    https://github.com/losdevpath/discord-bot/blob/master/LICENSE
*/
const Discord = require("discord.js");
const dateFormat = require('dateformat');
const codegen = require('node-code-generator');
const fs = require("fs");
const error = require("../utils/errors.js");
const config = require("../config.json");
const delay = ms => new Promise(res => setTimeout(res, ms));
var now = new Date();

exports.execute = async (bot, message, args, con) => {
  this_cmd = bot.commands.get("poll");
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
  function codeGenerator(num) {
    var gen = new codegen();
    var pattern = '########';
    var options = {};
    var code = gen.generateCodes(pattern, num, options);
    return code;
  }
  /* Poll data */
  const opts = args.join(" ").slice(args[0].length);
  let all = opts.split("|");
  for(i=0;i<all.length;i++) {
    if(all[i].includes("title=")) {
      var title = all[i].replace("title=", "");
    }
    if(all[i].includes("options=")) {
      var options = all[i].replace("options=", "");
    }
    if(all[i].includes("time=")) {
      var time = all[i].replace("time=", "");
    }
    if(all[i].includes("blind=")) {
      var blind = all[i].replace("blind=", "");
    }
    if(all[i].includes("results=")) {
      var results = all[i].replace("results=", "");
    }
    if(all[i].includes("role=")) {
      var role = all[i].replace("role=", "");
    }
  }
  if(!title) {
    return message.channel.send(
      { embed: {
          author: {
            name: this_cmd.info.title,
            icon_url: this_cmd.config.image
          },
          color: this_cmd.config.color,
          description: `You must include at least the title to be able to create a poll.`
        }
      }
    );
  }
  /* Poll */
  let date = dateFormat(now, config.server_date_format);
  let code = codeGenerator(1);
  var reaction_numbers = [
    "\u0030\u20E3",
    "\u0031\u20E3",
    "\u0032\u20E3",
    "\u0033\u20E3",
    "\u0034\u20E3",
    "\u0035\u20E3",
    "\u0036\u20E3",
    "\u0037\u20E3",
    "\u0038\u20E3",
    "\u0039\u20E3"
  ];
  let poll_embed = new Discord.RichEmbed();
  poll_embed.setAuthor(`Poll: ${title}`, this_cmd.config.image)
  poll_embed.setColor("#FF49E0");
  poll_embed.addField(`Created by`, `${message.author}\n\n\n`, true);
  poll_embed.addField(`Poll code`, `\`#${code}\``, true);
  poll_embed.addField(`Date`, `\`${date}\``, true);
  if(options) {
    const all_options = options;
    let poll_options = all_options.split(",");
    let list = "";
    let option;
    for(i=0;i<poll_options.length;i++) {
      if(i == 9) { break; }
      option = poll_options[i];
      if(i == 0) { react = reaction_numbers[1]; }
      if(i == 1) { react = reaction_numbers[2]; }
      if(i == 2) { react = reaction_numbers[3]; }
      if(i == 3) { react = reaction_numbers[4]; }
      if(i == 4) { react = reaction_numbers[5]; }
      if(i == 5) { react = reaction_numbers[6]; }
      if(i == 6) { react = reaction_numbers[7]; }
      if(i == 7) { react = reaction_numbers[8]; }
      if(i == 8) { react = reaction_numbers[9]; }
      list += `**${react}** ${option}\n`;
    }
    poll_embed.setDescription(`Vote this poll with reactions!\n\n**Options:**\n\n${list}\n\n\n`);
    const poll_message = await message.channel.send(poll_embed);
    for(i=0;i<poll_options.length;i++) {
      if(i == 9) { break; }
      if(i == 0) { await poll_message.react(reaction_numbers[1]); }
      if(i == 1) { await poll_message.react(reaction_numbers[2]); }
      if(i == 2) { await poll_message.react(reaction_numbers[3]); }
      if(i == 3) { await poll_message.react(reaction_numbers[4]); }
      if(i == 4) { await poll_message.react(reaction_numbers[5]); }
      if(i == 5) { await poll_message.react(reaction_numbers[6]); }
      if(i == 6) { await poll_message.react(reaction_numbers[7]); }
      if(i == 7) { await poll_message.react(reaction_numbers[8]); }
      if(i == 8) { await poll_message.react(reaction_numbers[9]); }
    }
    /* Collect reactions */
    const filter = (reaction, user) => !user.bot;
    const collector = poll_message.createReactionCollector(filter, { time: 15000 });
    collector.on('collect', r => console.log(`Collected ${r.emoji.name}`));
    collector.on('end', collected => console.log(`Collected ${collected.size} items`));
  } else {
    poll_embed.setDescription(`Vote this poll with reactions!`);
    const poll_message = await message.channel.send(poll_embed);
    await poll_message.react("✅");
    await poll_message.react("❌");
    /* Collect reactions */
    const filter = (reaction, user) => !user.bot;
    const collector = poll_message.createReactionCollector(filter, { time: 15000 });
    collector.on('collect', r => {
      //console.log(r.users);
    });
    collector.on('end', collected => {
      //console.log(`Collected ${collected.size} items`);
    });
  }
  /* Create poll on polls.json */
  var data = {
      "id": `${code}`,
      "title": `${title}`,
      "created": `${date}`,
      "author": `${message.author.username}`,
      "users": []
  };
  var polls_file = "./data/polls.json";
  var file = require("../data/polls.json");
  file.polls.push(data);
  fs.writeFile(polls_file, JSON.stringify(file, null, 2), function (err) {
    if (err) return console.log(err);
  });
}

exports.config = {
  name: "poll",
  aliases: ["pl"],
  permission: "staff",
  type: "global",
  color: "16730592",
  image: "https://i.imgur.com/RmZKBF4.png",
  guild_only: true,
  enabled: true
};

exports.info = {
  title: "Polls",
  description: "Create a simple poll or with multiple options.",
  usage: [
    `Simple poll:`,
    `\`${config.bot_prefix}poll title=message\``,
    `\nCreate a poll with multiple options:`,
    `\`${config.bot_prefix}poll title=message|options=Option 1,Option 2,...\``,
    `\nOptional:`,
    `\`|time=number\` - Close poll at X time.`,
    `\`|blind=true/false\` - Blind poll.`,
    `\`|results=true/false\` - Show results when the time is up.`,
    `\`|role=@role\` - Poll for a role.`,
    `\nAll options have to be separated with \`|\` so that the command works well.`
  ]
};