import { Client, GatewayIntentBits, Partials } from 'discord.js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Define the intents your bot needs
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
    partials: [Partials.Channel],
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('messageCreate', async message => {
    if (message.author.bot || !message.content.startsWith('!')) {
        return;
    }

    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift()?.toLowerCase();

    if (command === 'ping') {
        message.reply('Pong!');
    }
});

const token = process.env.DISCORD_BOT_TOKEN;

if (!token) {
    console.error('Error: DISCORD_BOT_TOKEN is not set. Please set it in your .env file.');
    process.exit(1);
}

client.login(token);
