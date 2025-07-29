"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
// Define the intents your bot needs
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent, // Required to read message content
        discord_js_1.GatewayIntentBits.GuildMembers, // Optional: if you need guild member information
    ],
    partials: [discord_js_1.Partials.Channel], // Optional: if you need to interact with DM channels
});
// Event handler for when the client is ready
client.once('ready', () => {
    var _a;
    console.log(`Logged in as ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.tag}!`);
});
// Event handler for when a message is created
client.on('messageCreate', (message) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Ignore messages from bots and messages that don't start with the prefix
    if (message.author.bot || !message.content.startsWith('!')) {
        return;
    }
    const args = message.content.slice(1).trim().split(/ +/);
    const command = (_a = args.shift()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    if (command === 'ping') {
        message.reply('Pong!');
    }
    // Add more commands here
}));
// Get the bot token from environment variables
const token = process.env.DISCORD_BOT_TOKEN;
if (!token) {
    console.error('Error: DISCORD_BOT_TOKEN is not set. Please set it in your .env file.');
    process.exit(1); // Exit if token is not found
}
// Log in to Discord with your client's token
client.login(token);
