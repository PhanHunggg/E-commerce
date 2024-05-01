"use strict";
const { Client, GatewayIntentBits } = require("discord.js");

const { TOKEN_DISCORD, CHANNEL_ID_DISCORD } = process.env;

class LoggerService {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.Guilds,
      ],
    });

    // add channelId
    this.channelId = CHANNEL_ID_DISCORD;

    this.client.on("ready", () => {
      console.log(`Logged is as ${this.client.user.tag}`);
    });

    this.client.login(TOKEN_DISCORD);
  }

  sendToFormatCode(logData) {
    const {
      code,
      message = "This is some additional information about the code!",
      title = "Code Example",
    } = logData;

    const codeMessage = {
      content: message,
      embeds: [
        {
          color: parseInt("00ff00", 16), //convert hexadecimal color code to integer
          title,
          description: "```json\n" + JSON.stringify(code, null, 2) + "\n```",
        },
      ],
    };

    this.sendToMessage(codeMessage);
  }

  sendToMessage(message = "message") {
    const channel = this.client.channels.cache.get(this.channelId);

    if (!channel) {
      console.error("Couldn't find the channel ...", this.channelId);
    }

    channel.send(message).catch((e) => console.error(e));
  }
}

module.exports = new LoggerService();
