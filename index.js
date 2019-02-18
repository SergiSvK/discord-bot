/*
*   @Author     LOSDEV
*   @Contact    losdevpath@gmail.com
*   @Github     https://github.com/losdevpath/discord-bot
*   @License    https://github.com/losdevpath/discord-bot/blob/master/LICENSE
*/
const Discord = require("discord.js");
const mysql = require("mysql");
const fs = require("fs");
const dotenv = require("dotenv").config();
const config = require("./config.json");
const botinfo = require("./botinfo.json");
const lang = require(`./langs/${config.server_lang}.json`);
const modules = require("./utils/modules.js");
const error = require("./utils/errors.js");
const bot = new Discord.Client({autoReconnect:true});
const delay = ms => new Promise(res => setTimeout(res, ms));
const invites = {};
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.polls = new Discord.Collection();

/* MySQL data */
var con = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  port: process.env.MYSQL_PORT,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

/* MySQL connect */
con.connect(err => {
  console.log(`~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~`);
  console.log(` > Loading database...`);
  console.log(`~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~`);
  if(err) {
    error.sqlError(err);
    process.exit();
  }
  /* Check SQL data */
  con.query(`SELECT id FROM users`, (err) =>{
    if(err) {
      error.tableNotFound();
      process.exit();
    }
  });
  console.log(" (!) Database connected!");
  console.log(`~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~`);
  console.log(` `);
});

/* Commands Loader */
fs.readdir("./commands/", (err, files) => {
  if(err) console.log(err);
  console.log(`~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~`);
  console.log(` `);
  console.log(` > ${botinfo.bot_name} by ${botinfo.bot_author} v${botinfo.bot_version}`);
  console.log(` `);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  console.log(`~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~`);
  console.log(` > Loading commands...`);
  console.log(`~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~`);
  if(jsfile.length <= 0){
    console.log(` (!) Not commands found.`);
    return;
  }
  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    bot.commands.set(props.config.name, props);
    console.log(` ${i + 1}: ${f} loaded!`);
  });
  console.log(`~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~`);
  console.log(` (!) ${jsfile.length} commands loaded.`);
  console.log(`~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~`);
  console.log(` `);
});

/* Bot ready */
bot.on("ready", async () => {
  console.log(`~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~`);
  console.log(` (!) ${bot.user.username} connected!`);
  console.log(`~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~`);
  /* Set bot base configurations */
  bot.user.setActivity(config.bot_activity_content, {type:config.bot_activity_type});
  bot.user.setUsername(config.bot_name);
  /* Invite link */
  try {
    let link = await bot.generateInvite(["ADMINISTRATOR"]);
    console.log(` `);
    console.log(`~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~`);
    console.log(` > Invitation link:`);
    console.log(` ${link}`);
    console.log(`~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~`);
  } catch(e) {
    console.log(e);
  }
  /* Set invite list */
  setTimeout(function(){
    bot.guilds.forEach(g => {
      g.fetchInvites().then(guildInvites => {
        invites[g.id] = guildInvites;
      });
    });
  }, 1000);
});

/* Raw reactions for old messages */
bot.on('raw', packet => {
  if(!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
  const channel = bot.channels.get(packet.d.channel_id);
  if(channel.messages.has(packet.d.message_id)) return;
  channel.fetchMessage(packet.d.message_id).then(message => {
      const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
      const reaction = message.reactions.get(emoji);
      if(packet.t === 'MESSAGE_REACTION_ADD') {
        bot.emit('messageReactionAdd', reaction, bot.users.get(packet.d.user_id));
      }
      if(packet.t === 'MESSAGE_REACTION_REMOVE') {
        bot.emit('messageReactionRemove', reaction, bot.users.get(packet.d.user_id));
      }
  });
});

/* Message Modules */
bot.on("message", async (message) => {
  modules.levelingSystem(message, con);
  await delay(100);
  modules.antiDiscordInvites(message, con);
  await delay(100);
  modules.commandSystem(message, con, bot);
});

/* guildMemberAdd Modules */
bot.on('guildMemberAdd', async (member) => {
  modules.welcomeSystem(member, con);
  await delay(100);
  modules.inviteSystem(member, con, invites, bot);
  await delay(100);
  modules.autoRoleOnJoin(member);
});

/* guildMemberRemove Modules */
bot.on('guildMemberRemove', member => {
  modules.leaveSystem(member, con);
});

/* messageReactionAdd Modules */
bot.on('messageReactionAdd', (reaction, user) => {
  modules.reactionAddRole(reaction, user, con);
  modules.reactionAddPoll(reaction, user, con, bot);
});

/* messageReactionRemove Modules */
bot.on('messageReactionRemove', (reaction, user) => {
  modules.reactionRemoveRole(reaction, user);
});

/* Bot login */
if(config.bot_token) {
  bot.login(config.bot_token);
} else {
  error.tokenNotFound();
  process.exit();
}