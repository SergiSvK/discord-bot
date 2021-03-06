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
```

## Commands

| Prefix | Config |
| ------ | ------ |
| ! | You can modify prefix in config.json -> "bot_prefix": "!" |

| Command | Aliases | Description | Permission | Usage |
| ------ | ------ | ------ | ------ | ------ |
| !4chan | !4c | Random images from 4chan.org | member | !4chan (list/board) |
| !8ball | !8b | Ask the magic ball a question. | member | !8ball (question) |
| !ban | !bh | Ban a member. | staff | !ban @member (reason) |
| !bot | !b | Change bot options | admin | !bot |
| !botinfo | !b | Information about the bot and author. | member | !botinfo |
| !channelinfo | !chan | Information about the channel. | member | !channelinfo (channel-name) |
| !clearchat | !cc | Clear messages of chat. | staff | !clearchat (number) |
| !commands | !c | Show all command list. | member |  !commands |
| !embed | !emb | Create an embed message. | staff |  !embed (message) |
| !fortune | !fc | Open a fortune cookie. | member |  !fortune |
| !giphy | !gp !gif | Show gifs from giphy.com. | member |  !giphy (text) |
| !leaderboard | !lb | Show member leaderboards. | member |  !leaderboard |
| !level | !lvl | Show level and experience. | member |  !level |
| !selfroles | !sr | Auto asignation of roles with reaction. | admin |  !selfroles |
