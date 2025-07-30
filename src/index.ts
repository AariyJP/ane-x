import { ApplicationCommandOptionType, REST, Routes, Client, Events, GatewayIntentBits, Partials, SnowflakeUtil, SlashCommandBuilder } from 'discord.js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();
const token = process.env.DISCORD_BOT_TOKEN || '';


const commands = [new SlashCommandBuilder()
.setName('x')
.setDescription('x')
.addStringOption(option =>
    option
        .setName('status')
        .setDescription('status')
        .setRequired(true)
)
.toJSON()];

const rest = new REST({ version: '10' }).setToken(token);



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

client.once(Events.ClientReady, async () => {

    console.log(`${client.user?.tag} でログインしました。`);
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationCommands(client.user?.id || ''), { body: commands });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'x') {
    await interaction.reply('Pong!');
  }
});

client.login(token);
