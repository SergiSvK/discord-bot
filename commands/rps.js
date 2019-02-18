/*
*   @Author     LOSDEV
*   @Contact    losdevpath@gmail.com
*   @Github     https://github.com/losdevpath/discord-bot
*   @License    https://github.com/losdevpath/discord-bot/blob/master/LICENSE
*/
const Discord = require("discord.js");
const config = require("../config.json");

exports.execute = (bot, message, args, con) => {
  this_cmd = bot.commands.get("rockpaperscissors");
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
  /* Select options */
  var user_option = args[1];
  let bot_option = Math.floor(Math.random() * 3);
  if(bot_option < 1) { bot_option = 1; }
  if(user_option > 3 || user_option < 1) {
    return message.channel.send(
      { embed: {
          author: {
            name: this_cmd.info.title,
            icon_url: this_cmd.config.image
          },
          color: this_cmd.config.color,
          description: `You must write a valid option to play.\n**Valid Options:** 1 = Rock, 2 = Paper, 3 = Scissors.`
        }
      }
    );
  }
  let emoji_rock = `✊`;
  let emoji_paper = `✋`;
  let emoji_scissors = `✌️`;
  let game_win = `Win`;
  let game_draw = `Draw`;
  let game_lose = `Lose`;
  let game_result;
  let game_reason;
  let user_option_emoji;
  let bot_option_emoji;
  /* Rock option */
  if(user_option == 1) {
    user_option_emoji = emoji_rock;
    if(bot_option == 1) {
      bot_option_emoji = emoji_rock;
      game_result = game_draw;
      game_reason = `${emoji_rock} same ${emoji_rock}`;
    }
    if(bot_option == 2) {
      bot_option_emoji = emoji_paper;
      game_result = game_lose;
      game_reason = `${emoji_rock} covered by ${emoji_paper}`;
    }
    if(bot_option == 3) {
      bot_option_emoji = emoji_scissors;
      game_result = game_win;
      game_reason = `${emoji_rock} break ${emoji_scissors}`;
    }
  }
  /* Paper option */
  if(user_option == 2) {
    user_option_emoji = emoji_paper;
    if(bot_option == 1) {
      bot_option_emoji = emoji_rock;
      game_result = game_win;
      game_reason = `${emoji_paper} cover ${emoji_rock}`;
    }
    if(bot_option == 2) {
      bot_option_emoji = emoji_paper;
      game_result = game_draw;
      game_reason = `${emoji_paper} same ${emoji_paper}`;
    }
    if(bot_option == 3) {
      bot_option_emoji = emoji_scissors;
      game_result = game_lose;
      game_reason = `${emoji_paper} cut by ${emoji_scissors}`;
    }
  }
  /* Scissors option */
  if(user_option == 3) {
    user_option_emoji = emoji_scissors;
    if(bot_option == 1) {
      bot_option_emoji = emoji_rock;
      game_result = game_lose;
      game_reason = `${emoji_scissors} break by ${emoji_rock}`;
    }
    if(bot_option == 2) {
      bot_option_emoji = emoji_paper;
      game_result = game_win;
      game_reason = `${emoji_scissors} cut ${emoji_paper}`;
    }
    if(bot_option == 3) {
      bot_option_emoji = emoji_scissors;
      game_result = game_draw;
      game_reason = `${emoji_scissors} same ${emoji_scissors}`;
    }
  }
  /* Game result */
  return message.channel.send(
    { embed: {
        author: {
          name: this_cmd.info.title,
          icon_url: this_cmd.config.image
        },
        color: this_cmd.config.color,
        description: ``,
        fields: [
          {
            name: "Your choice",
            value: `${user_option_emoji}`,
            inline: true
          },
          {
            name: "Bot choice",
            value: `${bot_option_emoji}`,
            inline: true
          },
          {
            name: "Result",
            value: `${message.author} **${game_result}**`,
            inline: true
          },
          {
            name: "Reason",
            value: `${game_reason}`
          }
        ]
      }
    }
  );

}

exports.config = {
  name: "rockpaperscissors",
  aliases: ["rps"],
  permission: "member",
  type: "command_channel",
  color: "16431435",
  image: "https://i.imgur.com/5XWnpoH.png",
  guild_only: true,
  enabled: true
};

exports.info = {
  title: "Rock Paper Scissors Game",
  description: "Play the game rock paper scissors!",
  usage: [
    `\`${config.bot_prefix}rockpaperscissors\` - More info.`,
    `\`${config.bot_prefix}rockpaperscissors (1/2/3)\` - Play the game!`
  ]
};