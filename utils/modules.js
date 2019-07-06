/*
*   @Author     LOSDEV
*   @Contact    losdevpath@gmail.com
*   @Github     https://github.com/losdevpath/discord-bot
*   @License    https://github.com/losdevpath/discord-bot/blob/master/LICENSE
*/
const Discord = require("discord.js");
const dateFormat = require('dateformat');
const mysql = require("mysql");
const fs = require("fs");
const config = require("../config.json");
const commandcheck = require("../utils/commandcheck.js");
const lang = require(`../langs/${config.server_lang}.json`);
const codegen = require('node-code-generator');
const delay = ms => new Promise(res => setTimeout(res, ms));

/* Check if module is active */
function moduleActive(name) {
    if(config.module_+name !== 'true') return;
}

/* Experience Generator */
function expGen(level) {
    let max = level * 30;
    let min = level * 20;
    return Math.floor(Math.random() * (max - min) ) + min;
}

/* Code Generator */
function codeGenerator(num) {
    var gen = new codegen();
    var pattern = '######';
    var options = {};
    var code = gen.generateCodes(pattern, num, options);
    return code;
  }

  /* Command System */
module.exports.commandSystem = (message, con, bot) => {
    if(message.author.bot) return;
    var u = message.author.username;
    var c = message.channel.name;
    var t = message.channel.type;
    var m = message.content;
    if(t === "dm") {c = "Bot-DM"}
    console.log("[" + c + "] " + u + ": " + m);
    if(!m.startsWith(config.bot_prefix)) return;
    var args = m.substring(config.bot_prefix.length).split(" ");
    var cmdName = args[0].toLowerCase();
    bot.commands.forEach(async (command) => {
        if(cmdName === command.config.name || command.config.aliases.includes(cmdName)) {
            try {
                let check = await commandcheck(command, message);
                if(!check) return command.execute(bot, message, args, con);
            } catch(e) {
                console.log(e);
            }
        }
    });
}
/* Leveling System */
module.exports.levelingSystem = (message, con) => {
    moduleActive('leveling');
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    function messageLevelUp(level, money) {
        let chan = message.guild.channels.get(config.channel_activity);
        chan.send(
        { embed: {
            author: {
                name: `${lang.level_levelup_title}`,
                icon_url: "https://i.imgur.com/7F2auUo.png"
            },
            thumbnail: {
                url: "https://i.imgur.com/4gIcukH.png"
            },
            color: 16759296,
            description: `**${message.author.username}** ${lang.level_reached} **${lang.level_level} ${level}**!\n${lang.level_won} **${config.server_money_sign}${money}** ${lang.level_levelup}`,
        }}).then(function (message) {
            message.react("⚡")
        });
    }
    function memberLevelUp(rows) {
        let sql;
        /* db data */
        let db_level = rows[0].level;
        let db_exp = rows[0].exp;
        let db_messages = rows[0].messages;
        let db_money = rows[0].money;
        /* new data */
        let extra_exp = expGen(db_level);
        let extra_money = db_level * 27;
        let new_level = db_level + 1;
        let new_exp = db_exp + extra_exp;
        let new_messages = db_messages + 1;
        let new_money = db_money + extra_money;
        /* Multiplier next level */
        let multiplier = 30;
        let level_mult = 5;
        if(db_level >= 10) { multiplier = 50; level_mult = 10; }
        if(db_level >= 20) { multiplier = 70; level_mult = 15; }
        if(db_level >= 30) { multiplier = 90; level_mult = 20; }
        if(db_level >= 40) { multiplier = 110; level_mult = 25; }
        if(db_level >= 50) { multiplier = 130; level_mult = 30; }
        if(db_level >= 60) { multiplier = 150; level_mult = 35; }
        if(db_level >= 70) { multiplier = 170; level_mult = 40; }
        if(db_level >= 80) { multiplier = 190; level_mult = 45; }
        if(db_level >= 90) { multiplier = 210; level_mult = 50; }
        if(db_level >= 100) { multiplier = 230; level_mult = 55; }
        let exp_to_next_level = multiplier * (db_level * level_mult);
        /* check leveling */
        if(new_exp >= exp_to_next_level) {
            sql = `UPDATE users SET exp=0, level=${new_level}, money=${new_money}, messages=${new_messages} WHERE uid='${message.author.id}' AND server='${message.guild.id}'`;
            con.query(sql);
            messageLevelUp(new_level, extra_money);
        } else {
            sql = `UPDATE users SET exp=${new_exp}, messages=${new_messages} WHERE uid='${message.author.id}' AND server='${message.guild.id}'`;
            con.query(sql);
        }
    }
    con.query(`SELECT * FROM users WHERE uid='${message.author.id}'`, (err, rows) => {
        if(err) throw err;
        if(rows.length < 1) {
            let sql = `INSERT INTO users (uid, exp, server, messages) VALUES ('${message.author.id}', '${expGen(1)}', '${message.guild.id}', '1')`;
            con.query(sql);
            return;
        } else {
            memberLevelUp(rows);
            return;
        }
    });
}

/* Anti discord invites */
module.exports.antiDiscordInvites = (message, con) => {
    moduleActive('antidiscordinvies');
    if(message.member.hasPermission("ADMINISTRATOR") || message.member.hasPermission("MANAGE_CHANNELS")) return;
    if(/(?:https?:\/)?discord(?:app.com\/invite|.gg)/gi.test(message.content)) {
        message.delete();
        let code = codeGenerator(1);
        let now = new Date();
        function banMessages(warns) {
            let date = dateFormat(now, config.server_date_format);
            let activity_chan = message.guild.channels.get(config.channel_activity);
            let reports_chan = message.guild.channels.get(config.channel_reports);
            if(reports_chan) {
                reports_chan.send(
                    { embed: {
                        author: {
                            name: `${lang.watchdog_banned_title} - ${lang.watchdog_title}`,
                            icon_url: "https://i.imgur.com/LGV2lqb.png"
                        },
                        color: 12483925,
                        fields: [
                            {
                                name: `${lang.watchdog_member}`,
                                value: `${message.author}`,
                                inline: true
                            },
                            {
                                name: `${lang.watchdog_date}`,
                                value: `${date}`,
                                inline: true
                            },
                            {
                                name: `${lang.watchdog_banid}`,
                                value: `\`#${code}\``,
                                inline: true
                            },
                            {
                                name: `${lang.watchdog_reason}`,
                                value: `\`\`\`${lang.watchdog_warn_limit} (${warns}/${config.server_warns_to_ban}).\`\`\``
                            }
                        ]
                    }
                });
            }
            if(activity_chan) {
                activity_chan.send(
                    { embed: {
                        author: {
                            name: `${lang.watchdog_banned_title} - ${lang.watchdog_title}`,
                            icon_url: "https://i.imgur.com/LGV2lqb.png"
                        },
                        color: 12483925,
                        fields: [
                            {
                                name: `${lang.watchdog_member}`,
                                value: `${message.author}`,
                                inline: true
                            },
                            {
                                name: `${lang.watchdog_warns}`,
                                value: `${warns}/${config.server_warns_to_ban}`,
                                inline: true
                            },
                            {
                                name: `${lang.watchdog_reason}`,
                                value: `${lang.watchdog_warn_limit}`,
                                inline: true
                            }
                        ]
                    }
                });
            }
            message.author.send(
                { embed: {
                    author: {
                        name: `${lang.watchdog_you_banned_title} - ${lang.watchdog_title}`,
                        icon_url: "https://i.imgur.com/LGV2lqb.png"
                    },
                    color: 12483925,
                    description: `${lang.watchdog_you_warn_limit}`,
                    fields: [
                        {
                            name: `${lang.watchdog_banid}`,
                            value: `\`#${code}\``,
                            inline: true
                        },
                        {
                            name: `${lang.watchdog_warns}`,
                            value: `${warns}/${config.server_warns_to_ban}`,
                            inline: true
                        },
                        {
                            name: `${lang.watchdog_date}`,
                            value: `\`${date}\``,
                            inline: true
                        },
                        {
                            name: `${lang.watchdog_reason}`,
                            value: `\`\`\`${lang.watchdog_you_banned_from} ${message.guild.name} ${lang.watchdog_you_banned_from_2}\`\`\``
                        }
                    ]
                }
            });
        }
        function warnMessages(warns) {
            let date = dateFormat(now, config.server_date_format);
            let activity_chan = message.guild.channels.get(config.channel_activity);
            let reports_chan = message.guild.channels.get(config.channel_reports);
            if(reports_chan) {
                reports_chan.send(
                    { embed: {
                        author: {
                            name: `${lang.watchdog_banned_title} - ${lang.watchdog_title}`,
                            icon_url: "https://i.imgur.com/LGV2lqb.png"
                        },
                        color: 12483925,
                        fields: [
                            {
                                name: `${lang.watchdog_member}`,
                                value: `${message.author}`,
                                inline: true
                            },
                            {
                                name: `${lang.watchdog_warns}`,
                                value: `${warns}/${config.server_warns_to_ban}`,
                                inline: true
                            },
                            {
                                name: `${lang.watchdog_date}`,
                                value: `\`${date}\``,
                                inline: true
                            },
                            {
                                name: `${lang.watchdog_channel}`,
                                value: `\`${message.channel.name}\``,
                                inline: true
                            },
                            {
                                name: `${lang.watchdog_warnid}`,
                                value: `\`#${code}\``,
                                inline: true
                            },
                            {
                                name: `${lang.watchdog_warn_reason}`,
                                value: `${lang.watchdog_spam_invite_link}`,
                                inline: true
                            },
                            {
                                name: `${lang.watchdog_message}`,
                                value: `\`\`\`${message.content}\`\`\``
                            },
                        ]
                    }
                });
            }
            if(activity_chan) {
                activity_chan.send(
                    { embed: {
                        author: {
                            name: `${lang.watchdog_banned_title} - ${lang.watchdog_title}`,
                            icon_url: "https://i.imgur.com/LGV2lqb.png"
                        },
                        color: 12483925,
                        fields: [
                            {
                                name: `${lang.watchdog_member}`,
                                value: `${message.author}`,
                                inline: true
                            },
                            {
                                name: `${lang.watchdog_warns}`,
                                value: `${warns}/${config.server_warns_to_ban}`,
                                inline: true
                            },
                            {
                                name: `${lang.watchdog_warn_reason}`,
                                value: `${lang.watchdog_spam_invite_link}`,
                                inline: true
                            }
                        ]
                    }
                });
            }
            message.author.send(
                { embed: {
                    author: {
                        name: `${lang.watchdog_you_warned_title} - ${lang.watchdog_title}`,
                        icon_url: "https://i.imgur.com/LGV2lqb.png"
                    },
                    color: 12483925,
                    description: `${lang.watchdog_you_warned_message}`,
                    fields: [
                        {
                            name: `${lang.watchdog_you}`,
                            value: `${message.author}`,
                            inline: true
                        },
                        {
                            name: `${lang.watchdog_warns}`,
                            value: `${warns}/${config.server_warns_to_ban}`,
                            inline: true
                        },
                        {
                            name: `${lang.watchdog_date}`,
                            value: `\`${date}\``,
                            inline: true
                        },
                        {
                            name: `${lang.watchdog_channel}`,
                            value: `\`${message.channel.name}\``,
                            inline: true
                        },
                        {
                            name: `${lang.watchdog_warnid}`,
                            value: `\`#${code}\``,
                            inline: true
                        },
                        {
                            name: `${lang.watchdog_warn_reason}`,
                            value: `${lang.watchdog_spam_invite_link}`,
                            inline: true
                        },
                        {
                            name: `${lang.watchdog_your_message}`,
                            value: `\`\`\`${message.content}\`\`\``
                        },
                    ]
                }
            });
        }
        con.query(`SELECT * FROM users WHERE uid='${message.author.id}' AND server='${message.guild.id}'`, (err, rows) => {
            if(err) throw err;
            let sql;
            let warns = rows[0].warns + 1;
            if(warns >= config.server_warns_to_ban) {
                banMessages(warns);
                let member_ban = message.guild.member(message.author);
                member_ban.ban('Has reached the limit of warns.')
                .then(() => console.log(`User ${member_ban.displayName} has been banned.`))
                .catch(console.error);
                return;
            } else {
                sql = `UPDATE users SET warns=${warns} WHERE uid='${message.author.id}' AND server='${message.guild.id}'`;
                con.query(sql);
                warnMessages(warns);
                return;
            }
        });
    }
}

/* Welcome System */
module.exports.welcomeSystem = (member, con) => {
    moduleActive('welcome');
    if(member.bot) return;
    let chan = member.guild.channels.get(config.channel_welcome);
    let member_tag = member.guild.members.get(member.user.id);
    chan.send(
        { embed: {
            author: {
                name: `${lang.welcome_new}`,
                icon_url: "https://i.imgur.com/xdzvRok.png"
            },
            thumbnail: {
                url: `${lang.welcome_image}`
            },
            color: 10019893,
            description: `${lang.welcome_welcome} ${member_tag} ${lang.welcome_to} **${member.guild.name}**!`,
        }
    }).then(function (message) {
        message.react("💚")
    });
    con.query(`SELECT * FROM users WHERE uid='${member.user.id}' AND server='${member.guild.id}'`, (err, rows) => {
        if(err) throw err;
        let sql;
        if(rows.length < 1) {
            sql = `INSERT INTO users (uid, server) VALUES ('${member.user.id}', '${member.guild.id}')`;
            con.query(sql);
        }
    });
}

/* Leave System */
module.exports.leaveSystem = (member, con) => {
    moduleActive('leave');
    if(member.bot) return;
    let chan = member.guild.channels.get(config.channel_welcome);
    chan.send(
        { embed: {
            author: {
                name: `${lang.leave_bye}`,
                icon_url: "https://i.imgur.com/5az7KL7.png"
            },
            color: 14630719,
            description: `${member.user.username} ${lang.leave_message}`,
        }
    });
    con.query(`DELETE FROM users WHERE uid='${member.user.id}' AND server='${member.guild.id}'`, (err) => {
        if(err) throw err;
        console.log(`User ${member.user.username} (${member.user.id}) has been deleted from the database.`);
    });
}

/* Auto Role On Join */
module.exports.autoRoleOnJoin = (member) => {
    moduleActive('autoroleonjoin');
    if(member.bot) return;
    //member.addRole(config.role_default);
}

/* Invite System */
module.exports.inviteSystem = (member, con, invites, bot) => {
    moduleActive('invite');
    if(member.bot) return;
    member.guild.fetchInvites().then(guildInvites => {
      const ei = invites[member.guild.id];
      invites[member.guild.id] = guildInvites;
      const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);
      const inviter = bot.users.get(invite.inviter.id);
      con.query(`SELECT * FROM users WHERE uid='${invite.inviter.id}' AND server='${member.guild.id}'`, (err, rows) => {
        if(err) throw err;
        let sql;
        /* db data */
        let db_level = rows[0].level;
        let db_invites = rows[0].invites;
        let db_exp = rows[0].exp;
        let db_money = rows[0].money;
        /* new data */
        let bonus_exp = db_level * 15;
        let bonus_money = db_level * 8;
        let new_invites = db_invites + 1;
        let new_exp = db_exp + bonus_exp;
        let new_money = db_money + bonus_money;
        let chan = member.guild.channels.get(config.channel_welcome);
        /* send message */
        chan.send(
            { embed: {
                author: {
                    name: `${lang.invite_title}`,
                    icon_url: "https://i.imgur.com/DNXdY77.png"
                },
                thumbnail: {
                    url: `${lang.invite_image}`
                },
                color: 7506394,
                description: `**${member.user.username}** ${lang.invite_message_1} ${invite.inviter.username}!\n**${invite.inviter.username}** ${lang.invite_message_2} **${bonus_exp}xp** ${lang.invite_message_3} **${config.server_money_sign}${bonus_money}**!\n${lang.invite_message_4} \`${invite.code}\` (**${invite.uses}** ${lang.invite_message_5})`,
            }
        });
        /* sql */
        sql = `UPDATE users SET exp=${new_exp}, invites=${new_invites}, money=${new_money} WHERE uid='${invite.inviter.id}' AND server='${member.guild.id}'`;
        con.query(sql);
      });
    });
}

/* Add role on message reaction */
module.exports.reactionAddRole = (reaction, user, con) => {
    moduleActive('rolereactions');
    if(user.bot) return;
    const rmsg = reaction.message;
    const title = rmsg.embeds[0].title;
    let selfroles = fs.readFileSync("data/selfroles.json");
    let data = JSON.parse(selfroles);
    let num_roles = Object.keys(data.roles).length;
    let title_role;
    let id_role;
    let color_role;
    let level_required;
    let role;
    for(i=0;i<num_roles;i++) {
        title_role = data["roles"][i]["title"];
        id_role = data["roles"][i]["id_role"];
        color_role = data["roles"][i]["color"];
        level_required = data["roles"][i]["level_required"];
        if(`${title}`.includes(`${title_role}`)) {
            rmsg.guild.fetchMember(user).then( member => {
                role = member.guild.roles.get(id_role);
                con.query(`SELECT * FROM users WHERE uid='${member.user.id}' AND server='${member.guild.id}'`, (err, rows) => {
                    if(err) throw err;
                    let sql;
                    if(rows.length < 1) {
                        sql = `INSERT INTO users (uid, server) VALUES ('${member.user.id}', '${member.guild.id}')`;
                        con.query(sql);
                    }
                    if(rows[0].level >= level_required) {
                        member.addRole(id_role);
                        member.send(
                            { embed:
                                {
                                    title: `${lang.roles_title}`,
                                    color: color_role,
                                    description: `${lang.roles_add_1} **${role.name}** ${lang.roles_add_2}`
                                }
                            }
                        );
                    } else {
                        reaction.remove(user);
                        member.send(
                            { embed: 
                                {
                                    title: `${lang.roles_title}`,
                                    color: color_role,
                                    description: `${lang.roles_no_level_1} **${lang.roles_no_level_2} ${level_required}** ${lang.roles_no_level_3} **${role.name}** ${lang.roles_no_level_4}`
                                }
                            }
                        );
                    }
                });
            });
            return;
        }
    }
}

module.exports.reactionRemoveRole = (reaction, user) => {
    moduleActive('rolereactions');
    if(user.bot) return;
    const rmsg = reaction.message;
    const title = rmsg.embeds[0].title;
    let selfroles = fs.readFileSync("data/selfroles.json");
    let data = JSON.parse(selfroles);
    let num_roles = Object.keys(data.roles).length;
    let title_role;
    let id_role;
    let color_role;
    let role;
    for(i=0;i<num_roles;i++) {
        title_role = data["roles"][i]["title"];
        id_role = data["roles"][i]["id_role"];
        color_role = data["roles"][i]["color"];
        if(`${title}`.includes(`${title_role}`)) {
            rmsg.guild.fetchMember(user).then( member => {
                member_role = member.roles.find(role => role.id === id_role);
                if(member_role) {
                    member.removeRole(id_role);
                    role = member.guild.roles.get(id_role);
                    return member.send(
                        { embed: 
                            { 
                                title: `${lang.roles_title}`,
                                color: color_role,
                                description:`${lang.roles_remove_1} **${role.name}** ${lang.roles_remove_2}`
                            }
                        }
                    );
                }
                return;
            });
            return;
        }
    }
}

/* Add reaction vote */
module.exports.reactionAddPoll = async (reaction, user, con, bot) => {
    if(user.bot) return;
    this_cmd = bot.commands.get("poll");
    const rmsg = reaction.message;
    if(!rmsg.embeds[0]) return;
    if(!rmsg.embeds[0].author) return;
    if(rmsg.embeds[0].author.name.includes(`Poll: `)) {
        const emoji = reaction.emoji;
        let poll_id = rmsg.embeds[0].fields[1].value.replace(/#/g,"").replace(/`/g,"");
        let user_id = user.id;
        let user_name = user.username;
        let server_id = rmsg.channel.guild.id;
        let emoji_name = emoji.name;
        let new_user = true;
        let react_date = new Date();
        let date = dateFormat(react_date, config.server_date_format);
        var polls_file = "./data/polls.json";
        var file = require("../data/polls.json");
        for(p=0;p<file.polls.length;p++) {
            if(file.polls[p].id == poll_id) {
                let poll_title = file.polls[p].title.replace("Poll: ","");
                for(u=0;u<file.polls[p].users.length;u++) {
                    if(file.polls[p].users[u].id == user_id) {
                        reaction.remove(user);
                        user.send(
                            { embed: {
                                author: {
                                  name: `You have already voted! - Polls`,
                                  icon_url: this_cmd.config.image
                                },
                                color: this_cmd.config.color,
                                description: `You have already voted this poll! Delete your vote to vote another option.`
                              }
                            }
                        );
                        console.log("already voted!");
                        new_user = false;
                        break;
                    }
                }
                delay(300);
                if(new_user) {
                    var user = {
                        "id": `${user_id}`,
                        "user": `${user_name}`,
                        "vote": `${emoji_name}`,
                        "date": `${date}`
                    };
                    file.polls[p].users.push(user);
                    fs.writeFile(polls_file, JSON.stringify(file, null, 2), function (err) {
                        if(err) return console.log(err);
                    });
                    user.send(
                        { embed: {
                            author: {
                              name: `You have voted! - Polls`,
                              icon_url: this_cmd.config.image
                            },
                            color: this_cmd.config.color,
                            fields: [
                                {
                                    name: "Poll",
                                    value: `${poll_title}`,
                                    inline: true
                                },
                                {
                                    name: "ID",
                                    value: `\`#${poll_id}\``,
                                    inline: true
                                },
                                {
                                    name: "Date",
                                    value: `\`${date}\``,
                                    inline: true
                                },
                                {
                                    name: "Your vote",
                                    value: `${emoji_name}`,
                                    inline: true
                                }
                            ]
                          }
                        }
                    );
                    break;
                }

            }
        }
    }
}

/* Remove reaction vote */
module.exports.reactionRemovePoll = async (reaction, user, con, bot) => {
    if(user.bot) return;
    this_cmd = bot.commands.get("poll");
    const rmsg = reaction.message;
    if(!rmsg.embeds[0]) return;
    if(!rmsg.embeds[0].author) return;
    if(rmsg.embeds[0].author.name.includes(`Poll: `)) {
        const emoji = reaction.emoji;
        let poll_id = rmsg.embeds[0].fields[1].value.replace(/#/g,"").replace(/`/g,"");
        let user_id = user.id;
        let user_name = user.username;
        let server_id = rmsg.channel.guild.id;
        let emoji_name = emoji.name;
        let new_user = true;
        let react_date = new Date();
        let date = dateFormat(react_date, config.server_date_format);
        var polls_file = "./data/polls.json";
        var file = require("../data/polls.json");
        for(p=0;p<file.polls.length;p++) {
            if(file.polls[p].id == poll_id) {
                // test
            }
        }
    }
}