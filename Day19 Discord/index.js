require("dotenv").config();

const { Client, GatewayIntentBits, AttachmentBuilder } = require("discord.js");
const { GoogleGenAI } = require("@google/genai");

const dns = require("node:dns");
dns.setServers = ["8.8.8.8", "1.1.1.1"];

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateContent(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
  });
  return response.text;
}

client.once("ready", () => {
  console.log("Bot is Ready.");
});

client.on("messageCreate", async (message) => {
  const isBot = message.author.bot;
  if (isBot) return;

  const res = await generateContent(message.content);
  if (res) {
    message.reply(res);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
