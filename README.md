<h1 align="center">
  Discord-Bot by <a href="https://losdev.es" target="_blank">LOSDEV</a>
</h1>
<p align="center">
  <a href="#commands">Commands</a> •
  <a href="#requirements">Requirements</a> •
  <a href="#installation">Installation</a> •
  <a href="#images">Images</a>
</p>
<p align="center">
  <a href="https://discord.gg/d2fxfwk"><img src="https://img.shields.io/discord/424697508103716865.svg?colorB=%237289da&label=Discord&logo=Discord&logoColor=%23ffffff&style=flat"></a>
  <a href="#_"><img src="https://img.shields.io/github/downloads/losdevpath/discord-bot/total.svg?style=flat"></a>
  <a href="#_"><img src="https://img.shields.io/github/license/losdevpath/discord-bot.svg?style=flat"></a>
  <a href="#_"><img src="https://img.shields.io/github/last-commit/losdevpath/discord-bot.svg?style=flat"></a>
  <a href="#_"><img src="https://img.shields.io/github/stars/losdevpath/discord-bot.svg?style=flat"></a>
  <a href="#_"><img src="https://img.shields.io/github/watchers/losdevpath/discord-bot.svg?style=flat"></a>
</p>

## Requirements
- Dedicated Server or VPS
- MySQL
- [Git](https://git-scm.com)
- [NodeJS](https://nodejs.org/es/)

## Installation
```bash
# 1. Clone the repository
$ git clone https://github.com/losdevpath/discord-bot

# 2. Access the folder
$ cd discord-bot

# 3. Install the dependencies
$ npm install

# 4. Rename the .example.env file and fill with mysql information.
$ mv .example.env .env

# 5. Create new bot application here
https://discordapp.com/developers/applications

# 6. Paste the token bot in config.json file
"bot_token": "token here"

# 7. Run the bot
$ npm run index
or
$ node index.js
or
$ pm2 start index.js --name "bot-name"
