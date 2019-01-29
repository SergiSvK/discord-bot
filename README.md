<h1 align="center">
  DISCORD BOT
  <br>by <a href="https://losdev.es" target="_blank">LOSDEV</a>
</h1>
<p align="center">
  <a href="#commands">Commands</a> •
  <a href="#requirements">Requirements</a> •
  <a href="#installation">Installation</a> •
  <a href="#images">Images</a>
</p>

## Commands
* !4chan (forum)
  - Show an image of a 4chan forum.
* !help
  - Displays a list of available commands.
* !8ball (question)
  - Ask the magic ball a question.
* !bot
  - Bot information.
* !botchat (message)
  - Speak on behalf of the bot. (Admin)
* !channel
  - Information of the channel where you write this command.
* !remove (number)
  - Remove a number of messages from the channel. (Staff)
* !embed (message)
  - Escribe en un mensaje embebido. (Admin)
* !fortune
  - Open a fortune cookie.
* !giphy
  - Show random gifs of the page giphy.com.
* !minecraft
  - State of minecraft.net, server information, etc.
* !level
  - Show your level and experience.
* !new (message)
  - Write a news item on behalf of the server. (Admin)
* !profile (member)
  - Show your profile or that of a member.
* !report (member) (message)
  - Report a member.
* !rps
  - Rock, paper, scissors, lizard, spock.
* !server
  - Information about the server.
* !steam (member)
  - Show your steam account or another member.
* !suggerence (message)
  - Send a suggestion
* !music (play) (url)
  - Play Youtube music on a voice channel.

## Requirements
- Dedicated Server or VPS
- MySQL
- [Git](https://git-scm.com)
- [NodeJS](https://nodejs.org/es/)

## Installation
```bash
# Clone the repository
$ git clone https://github.com/losdevpath/discord-bot

# Access the folder
$ cd discord-bot

# Install the dependencies
$ npm install

# Rename the .example.env file and fill the information.
$ mv .example.env .env

# Run the bot
$ npm run index
or
$ node index.js
or
$ pm2 start index.js --name "bot-name"

# Create new application bot here
https://discordapp.com/developers/applications

# Change [CLIENT ID] by the ID of your bot and enter the link to add it to your server
https://discordapp.com/oauth2/authorize?client_id=[CLIENT ID]&scope=bot&permissions=8
```

## Images
<p align="center">
  <img src="https://i.imgur.com/w5vkUVQ.png"><br>
  Commands
</p>
<p align="center">
  <img src="https://i.imgur.com/cF6bw7P.png"><br>
  Youtube music
</p>
<p align="center">
  <img src="https://i.imgur.com/ZOCrNmU.png"><br>
  Minecraft server information
</p>
<p align="center">
  <img src="https://i.imgur.com/dCfZSE9.png"><br>
  Welcome message
</p>
