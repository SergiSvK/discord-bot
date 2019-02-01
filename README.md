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
  <img src="https://img.shields.io/github/downloads/losdevpath/discord-bot/total.svg?style=flat" />
  <img src="https://img.shields.io/github/license/losdevpath/discord-bot.svg?style=flat">
  <img src="https://img.shields.io/github/last-commit/losdevpath/discord-bot.svg?style=flat">
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

# 8. Copy invite link from console and paste in your browser to invite the bot to your server.
```
## Commands
| Prefix | Config |
| ------ | ------ | 
| ! | You can modify prefix in config.json -> "bot_prefix": "!" |

| Command | Aliases | Description | Permission | Usage
| ------ | ------ | ------ | ------ | ------ |
| !4chan | !4c | Random images from 4chan.org | member | !4chan (list/board) |
| !8ball | !8b | Ask the magic ball a question. | member | !8ball (question) |
| !bot | !b | Information about the bot and author. | member | !bot |
| !channel | !chan | Information about the channel. | member | !channel (channel-name) |
| !clearchat | !cc | Clear messages of chat. | staff | !clearchat (number) |
| !commands | !c | Show all command list. | member |  !commands |
| !embed | !emb | Create an embed message. | staff |  !embed (message) |
| !fortune | !f | Open a fortune cookie. | member |  !fortune |
| !giphy | !g | Show gifs from giphy.com. | member |  !giphy (text) |
| !level | !lvl | Show level and experience. | member |  !level |
| !selfroles | !sr | Auto asignation of roles with reaction. | admin |  !selfroles |
