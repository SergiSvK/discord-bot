<h1 align="center">
  DISCORD BOT
  <br>by <a href="https://losdev.es" target="_blank">LOSDEV</a>
</h1>
<p align="center">
  <a href="#commands">Commands</a> •
  <a href="#installation">Installation</a> •
  <a href="#images">Images</a>
</p>

## Commands
* !4chan
  - Muestra una imagen de un foro de 4chan.
* !ayuda
  - Muestra una lista de los comandos disponibles.
* !8ball
  - Haz una pregunta a la bola mágica.
* !bot
  - Información del bot.
* !botchat
  - Habla en nombre del bot. (Admin)
* !canal
  - Información del canal donde escribes este comando.
* !config
  - Cambiar la configuración del servidor. (Admin)
* !eliminar
  - Elimina una cantidad de mensajes del canal. (Staff)
* !embed
  - Escribe en un mensaje embebido. (Admin)
* !fortuna
  - Abre una galleta de la fortuna.
* !giphy
  - Muestra gifs random de la página giphy.com.
* !minecraft
  - Estado de minecraft.net, información de servidores, etc.
* !nivel
  - Muestra tu nivel y experiencia.
* !noticia
  - Escribe una noticia en nombre del servidor. (Admin)
* !perfil
  - Muestra tu perfil o el de un miembro.
* !rango
  - Añade un rango a tu perfil.
* !reportar
  - Reporta a un miembro del servidor.
* !rps
  - Piedra, papel, tijera, lagarto, spock.
* !server
  - Información sobre el servidor.
* !steam
  - Muestra tu cuenta de steam o de otro miembro.
* !sugerencia
  - Envia una sugerencia.
* !youtube
  - Reproduce música de youtube en un canal de voz.

## Installation
Requisitos:
- Dedicated Server or VPS
- MySQL
- [Git](https://git-scm.com)
- [NodeJS](https://nodejs.org/es/)

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
```
## Imágenes
<p align="center">
  <img src="https://i.imgur.com/w5vkUVQ.png"><br>
  Lista completa de comandos
</p>
<p align="center">
  <img src="https://i.imgur.com/cF6bw7P.png"><br>
  Radio
</p>
<p align="center">
  <img src="https://i.imgur.com/ZOCrNmU.png"><br>
  Servidor de Minecraft
</p>
<p align="center">
  <img src="https://i.imgur.com/dCfZSE9.png"><br>
  Mensaje de Bienvenida
</p>
