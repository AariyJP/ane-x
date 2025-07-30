import {
    REST,
    Routes,
    Client,
    Events,
    GatewayIntentBits,
    Partials,
    SlashCommandBuilder,
} from "discord.js";
import { TwitterApi } from "twitter-api-v2";
import dotenv from "dotenv";

dotenv.config();
const token = process.env.DISCORD_BOT_TOKEN || "";
const xtoken = process.env.X_BEARER_TOKEN || "";
const clientId = process.env.X_CLIENT_ID || "";
const clientSecret = process.env.X_CLIENT_SECRET || "";
const appKey = process.env.X_APP_KEY || "";
const appSecret = process.env.X_APP_SECRET || "";
const accessToken = process.env.X_ACCESS_TOKEN || "";
const accessSecret = process.env.X_ACCESS_SECRET || "";

process.on('uncaughtException', (err) => {
  console.error(err);
});

// const XApp = new TwitterApi({ clientId: clientId, clientSecret: clientSecret });
const XApp = new TwitterApi({
    appKey: appKey,
    appSecret: appSecret,
    accessToken: accessToken,
    accessSecret: accessSecret,
});

const commands = [
    new SlashCommandBuilder()
        .setName("x")
        .setDescription("x")
        .addStringOption((option) =>
            option.setName("status").setDescription("status").setRequired(true)
        )
        .addAttachmentOption((option) =>
            option.setName("image0").setDescription("image0").setRequired(false)
        )
        .addIntegerOption((option) =>
            option.setName("user").setDescription("user").setRequired(false)
        )
        .setDefaultMemberPermissions(0)
        .toJSON(),
    new SlashCommandBuilder()
        .setName("xoauth2")
        .setDescription("xoauth2")
        .setDefaultMemberPermissions(0)
        .toJSON(),
    new SlashCommandBuilder()
        .setName("xverify")
        .setDescription("xverify")
        .setDefaultMemberPermissions(0)
        .toJSON(),
];
const rest = new REST({ version: "10" }).setToken(token);

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
        await rest.put(Routes.applicationCommands(client.user?.id || ""), {
            body: commands,
        });
        console.log("アプリケーションコマンドを登録しました。");
    } catch (error) {
        console.error(error);
    }
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    switch (interaction.commandName) {
        case "xoauth2":
            // await interaction.reply(XApp.generateOAuth2AuthLink("http://localhost", {scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access']}).url)
            break;
        case "xverify":
            // await interaction.reply("xverify command executed.")
            break;
        case "x":
            await interaction.deferReply({ flags: "Ephemeral" });
            const status = interaction.options.getString("status")!;
            await interaction.editReply({content: status});
            break;
        default:
            await interaction.reply("Unknown command.");
            break;
    }
});

client.login(token);
