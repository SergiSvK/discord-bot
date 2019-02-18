/*
*   @Author     LOSDEV
*   @Contact    losdevpath@gmail.com
*   @Github     https://github.com/losdevpath/discord-bot
*   @License    https://github.com/losdevpath/discord-bot/blob/master/LICENSE
*/
const Discord = require("discord.js");
const error_color = 16719904;
const info_color = 6086143;
CRED = '\033[91m';
CEND = '\033[0m';

/* No perms */
module.exports.noPerms = (message) => {
    message.author.send(
        { embed:
            {
                title: `Insufficient permissions - User Error`,
                description: `You do not have enough permissions to execute that command.`,
                color: error_color,
                footer: {
                    text: `Error Code - #5912`
                }
            }
        }
    );
}

/* Perms */
module.exports.equalPerms = (message, user, perms) => {
    message.author.send(
        { embed:
            {
                title: `Permissions - User Info`,
                description: `${user} have perm ${perms}`,
                color: info_color,
                footer: {
                    text: `Info Code - #1823`
                }
            }
        }
    );
}

/* Bot user */
module.exports.botUser = (message) => {
    message.author.send(
        { embed:
            {
                title: `You are a human - Bot Error`,
                description: `A human can't ban me!`,
                color: error_color,
                footer: {
                    text: `Error Code - #9341`
                }
            }
        }
    );
}

/* Can't find user */
module.exports.cantFindUser = (message) => {
    message.author.send(
        { embed:
            {
                title: `User not found - Server Error`,
                description: `I can't find that user.`,
                color: error_color,
                footer: {
                    text: `Error Code - #7712`
                }
            }
        }
    );
}

/* No reason */
module.exports.noReason = (message) => {
    message.author.send(
        { embed:
            {
                title: `Reason not found - Syntax Error`,
                description: `You must write a reason.`,
                color: error_color,
                footer: {
                    text: `Error Code - #8911`
                }
            }
        }
    );
}

/* Only guild */
module.exports.onlyGuild = (message) => {
    message.author.send(
        { embed:
            {
                title: `Server command - Command Error`,
                description: `That command only works on a server channel.`,
                color: error_color,
                footer: {
                    text: `Error Code - #8173`
                }
            }
        }
    );
}

/* Channel required */
module.exports.channelRequired = (message, channel) => {
    message.channel.send(
        { embed:
            {
                title: `Command channel required - Syntax Error`,
                description: `That command can only be put on #${channel.name} channel.`,
                color: error_color,
                footer: {
                    text: `Error Code - #5512`
                }
            }
        }
    );
}

/* Channel not found */
module.exports.channelNotFound = (message, args) => {
    let chan = args[1];
    message.channel.send(
        { embed:
            {
                title: `Channel not found - Server Error`,
                description: `The channel #${chan} not found.`,
                color: error_color,
                footer: {
                    text: `Error Code - #0941`
                }
            }
        }
    );
}

/* Channel not set */
module.exports.channelNotSet = (message, type) => {
    message.channel.send(
        { embed:
            {
                title: `Channel not set - System Error`,
                description: `The \`${type}\` channel has not been set in bot config. Contact an administrator to fix this.`,
                color: error_color,
                footer: {
                    text: `Error Code - #9591`
                }
            }
        }
    );
}

/* Gifs not found */
module.exports.gifsNotFound = (message, gif) => {
    message.channel.send(
        { embed:
            {
                title: `Gifs not found - Giphy Error`,
                description: `Not found gifs with key \`${gif}\` on giphy.com`,
                color: error_color,
                footer: {
                    text: `Error Code - #7840`
                }
            }
        }
    );
}

module.exports.noApiKey = (message, type) => {
    let api;
    if(type == "steam") { api = "Steam API Key"; }
    if(type == "google") { api = "Google API Key"; }
    if(type == "giphy") { api = "Giphy API Key"; }
    console.log(CRED+`\n (X) API KEY ERROR: The ${api} not found.\n\n`+CEND);
    message.channel.send(
        { embed:
            {
                title: `API Key not found - System Error`,
                description: `The ${api} not found. Contact an administrator to solve the problem.`,
                color: error_color,
                footer: {
                    text: `Error Code - #5824`
                }
            }
        }
    );
}

/* Sql error */
module.exports.sqlError = (err) => {
    console.log(CRED+`\n (X) SQL ERROR:\n`);
    console.warn(err);
    console.log(CEND);
}

/* Users.sql not imported to database */
module.exports.tableNotFound = () => {
    console.log(CRED+`\n (X) SQL TABLE ERROR: Please import users.sql to your database.\n\n`+CEND);
}

/* Bot token not found */
module.exports.tokenNotFound = () => {
    console.log(CRED+`\n (X) BOT ERROR: Bot token not found. Please fill config.json file with bot token.\n\n`+CEND);
}