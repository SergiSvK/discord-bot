/*
*   Discord Bot by LOSDEV
*   Website: losdev.es
*   Email: losdevpath@gmail.com
*/
const Discord = require("discord.js");
const mysql = require("mysql");
const fs = require("fs");
const dotenv = require("dotenv").config();
const config = require("./config.json");
const botinfo = require("./version.json");
const errors = require("./utils/errores.js");
const lang = require(`./languages/${config.lang}.json`);
const bot = new Discord.Client({ autoReconnect: true });
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
const invites = {};

/* MySQL */
var con = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  port: process.env.MYSQL_PORT,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});
con.connect(err => {
  console.log(`~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~`);
  console.log(` > Loading database...`);
  console.log(`~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~`);
  if(err) {
    console.warn('Error trying to connect to the database: ' + err);
    throw err;
  }
  console.log("(!) Database connected!");
  console.log(`~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~`);
  console.log(` `);
});

/* Commands */
fs.readdir("./commands/", (err, files) => {
  if(err) console.log(err);
  console.log(`~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~`);
  console.log(` `);
  console.log(` > Discord Bot`);
  console.log(` > by LOSDEV`);
  console.log(` `);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  console.log(`~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~`);
  console.log(` > Loading commands...`);
  console.log(`~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~`);
  if(jsfile.length <= 0){
    console.log(`(!) Not commands found.`);
    return;
  }
  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`${i + 1}: ${f} cargado!`);
    bot.commands.set(props.info.name, props);
  });
  console.log(`~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~`);
  console.log(`(!) ${jsfile.length} commands loaded.`);
  console.log(`~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~`);
  console.log(` `);
});

/* Import modules */
fs.readdir("./modules/", (err, files) => {
  if(err) console.log(err);
  console.log(`~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~`);
  console.log(` > Loading modules...`);
  console.log(`~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~`);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if(jsfile.length <= 0) {
    console.log(`(!) Not modules found.`);
    return;
  }
  jsfile.forEach((f, i) => {
    let module_name = `${f}`;
    const module_name = require(`./modules/${f}`);
    console.log(`${i + 1}: ${f} cargado!`);
  });
  console.log(`~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~`);
  console.log(`(!) ${jsfile.length} modules loaded.`);
  console.log(`~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~`);
  console.log(` `);
});

/* Bot ready */
bot.on("ready", () => {
  console.log(`---------------------------------`);
  console.log(`(!) ${bot.user.username} it's online!`);
  console.log(`---------------------------------`);
  bot.user.setActivity(config.actividad, {type: config.tipo_actividad});
  setTimeout(function(){
    bot.guilds.forEach(g => {
      g.fetchInvites().then(guildInvites => {
        invites[g.id] = guildInvites;
      });
    });
  }, 1000);
});

fs.readdir("./modules/", (err, files) => {
  if(err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  jsfile.forEach((f, i) => {
    if(f == "welcome") {
    }
  });
});


/* Exp generator */
function generateXp() {
  return Math.floor(Math.random() * 7) + 8;
}

/* Level system */
bot.on("message", message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;
  let active = config.leveling_active;
  if(active === "false") { return message.channel.send(`**ERROR:** El sistema de niveles está desactivado.`); }
  if(message.channel.id == config.command_channel_id) {
    return;
  }
  con.query(`SELECT * FROM users WHERE id='${message.author.id}' and server='${message.guild.id}'`, (err, rows) => {
    if(err) throw err;
    let sql;
    if(rows.length < 1) {
      sql = `INSERT INTO users (id, exp, level, server, messages) VALUES ('${message.author.id}', '${generateXp()}', '1', '${message.guild.id}', '1')`;
    } else {
      let mensajes = rows[0].messages;
      let newMensajes = mensajes + 1;
      let currentExp = rows[0].exp;
      let currentLvl = rows[0].level;
      let money = rows[0].money;
      let newLvl = currentLvl * 300;
      let addExp = generateXp();
      let newExpDB = currentExp + addExp;
      if(newLvl <= currentExp) {
        let newLvlDB = currentLvl + 1;
        let addMoney = newLvlDB * 15;
        let newMoney = money + addMoney;
        let levelup = new Discord.RichEmbed()
        .setTitle(`:arrow_up: ${message.author.username} ha subido de nivel!`)
        .setThumbnail(message.author.displayAvatarURL)
        .setColor("#94ec25")
        .setDescription(`**¡¡Enhorabuena!!** 🎉 Has subido al **Nivel ${newLvlDB}**!!.\nSigue participando para desbloquear nuevas funciones!!\nHas ganado **${addMoney} ${config.moneda_plural}** por subir de nivel.`)
        .setFooter(`${botinfo.nombre} v${botinfo.version}`, botinfo.imagen);
        let channel = message.guild.channels.get(config.activity_channel_id);
        channel.send(levelup).then(function (message){
          message.react("👍")
          .then(() => message.react("🎉"))
          .catch(() => console.error('One of the emojis failed to react.'));
        });
        sql = `UPDATE users SET exp=${newExpDB}, level=${newLvlDB}, money=${newMoney}, messages=${newMensajes} WHERE id='${message.author.id}' and server='${message.guild.id}'`;
      } else {
        sql = `UPDATE users SET exp=${newExpDB}, messages=${newMensajes} WHERE id='${message.author.id}' and server='${message.guild.id}'`;
      }
    }
    con.query(sql);
  });
});

/* Spam security */
bot.on("message", message => {
  if(/(?:https?:\/)?discord(?:app.com\/invite|.gg)/gi.test(message.content)) {
    if(!message.member.hasPermission("ADMINISTRATOR")) {
      message.delete();
      return;
    }
  }
});

/* Command system */
bot.on("message", message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;
  var u = message.author.username;
  var c = message.channel.name;
  var m = message.content;
  console.log("[" + message.guild.name + "] [" + c + "] " + u + ": " + m);
  if(!m.startsWith(config.prefijo)) return;
  var args = m.substring(config.prefijo.length).split(" ");
  var cmdName = args[0].toLowerCase();
  bot.commands.forEach(command => {
    if(cmdName === command.info.name || command.info.alias.includes(cmdName)) {
      if(command.info.guildOnly && message.channel.guild == undefined) return message.channel.send(":poop: Ese comando no se puede escribir en privado.");
      if(command.info.permission == "admin" && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(":poop: Ese comando es de admin! :^)");
      if(command.info.permission == "staff" && !message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(":poop: Ese comando es de staff! :^)");
      command.execute(bot, message, args, con);
    }
  });
});

/* Leave system */
bot.on('guildMemberRemove', member => {
  // Comprobar si el sistema está activo
  let bienvanidaActivo = config.bienvenida_activo;
  if(bienvanidaActivo === "false") return;
  // Comprobar si el canal existe
  let welcomeChannel = member.guild.channels.get(config.canal_bienvenida);
  if (!welcomeChannel) return;
  // Sistema de despedida
  let embedData = new Discord.RichEmbed()
  .setAuthor(`Un miembro nos ha dejado...`)
  .setThumbnail(member.user.avatarURL)
  .setColor('#d13e3e')
  .setDescription(`**${member.user.username}** ha abandonado el servidor! 💔`);
  welcomeChannel.send(embedData).then(function(message) {
    message.react("💩")
  });
});

// ===========================================
// AUTO-RANGO - Asignación de rango al entrar
// ===========================================
bot.on('guildMemberAdd', member => {
  // Comprobar si el sistema está activo
  let autorangoActivo = config.autorango_activo;
  if(autorangoActivo === "false") return;
  // Sistema de autorango
  member.addRole(config.autorango_rangoid);
});

// ====================================================
// SISTEMA INVITACIÓN - Mostrar invitación
// ====================================================
bot.on('guildMemberAdd', member => {
  member.guild.fetchInvites().then(guildInvites => {
    const ei = invites[member.guild.id];
    invites[member.guild.id] = guildInvites;
    const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);
    const inviter = bot.users.get(invite.inviter.id);
    con.query(`SELECT * FROM usuarios WHERE id='${invite.inviter.id}' and servidor='${member.guild.id}'`, (err, rows) => {
      if(err) throw err;
      let sql;
      let invitaciones = rows[0].invitaciones;
      let newInvitaciones = invitaciones + 1;
      let currentExp = rows[0].exp;
      let currentMoney = rows[0].dinero;
      let numRand = generateXp();
      let bonusExp = numRand * 8;
      let bonusMoney = numRand * 6;
      let newExp = currentExp + bonusExp;
      let newMoney = currentMoney + bonusMoney;
      let newInvite = new Discord.RichEmbed()
      .setTitle(`:tickets: Nueva invitación canjeada!`)
      .setColor("#ff005d")
      .setDescription(`**${member.user.username}** ha usado el código de invitación de ${invite.inviter.username}!\n**${invite.inviter.username}** ha ganado un bonus de **${bonusExp} puntos de experiencia** y **${bonusMoney} monedas**!\nCódigo de invitación usado: ${invite.code} (**${invite.uses}** invitaciones)`)
      .setFooter(`${botinfo.nombre} v${botinfo.version}`, botinfo.imagen);
      let activityChannel = member.guild.channels.get(config.canal_actividad);
      activityChannel.send(newInvite).then(function (message) {
        message.react("👍")
        .then(() => message.react("🎉"))
        .catch(() => console.error('ERROR: One of the emojis failed to react.'));
      });
      sql = `UPDATE usuarios SET exp=${newExp}, invitaciones=${newInvitaciones}, dinero=${newMoney} WHERE id='${invite.inviter.id}' and servidor='${member.guild.id}'`;
      con.query(sql);
    });
  });
});

// Logear el bot
bot.login(config.discord_token);