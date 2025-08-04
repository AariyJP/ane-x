import {
    REST,
    Routes,
    Client,
    Events,
    GatewayIntentBits,
    Partials,
    SlashCommandBuilder,
    ApplicationIntegrationType,
    Collection
} from "discord.js";
import { TwitterApi } from "twitter-api-v2";
import dotenv from "dotenv";
import { execute as x } from "./commands/x";

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
export const XApp = new TwitterApi({
    appKey: appKey,
    appSecret: appSecret,
    accessToken: accessToken,
    accessSecret: accessSecret,
});

let commands = [
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
        .setIntegrationTypes(ApplicationIntegrationType.UserInstall)
        .toJSON(),
    new SlashCommandBuilder()
        .setName("xoauth2")
        .setDescription("xoauth2")
        .setDefaultMemberPermissions(0)
        .setIntegrationTypes(ApplicationIntegrationType.UserInstall)
        .toJSON(),
    new SlashCommandBuilder()
        .setName("xverify")
        .setDescription("xverify")
        .setDefaultMemberPermissions(0)
        .setIntegrationTypes(ApplicationIntegrationType.UserInstall)
        .toJSON(),
];
commands =
[
    {
        "default_member_permissions": "0",
        "type": 1,
        "name": "x",
        "description": "x",
        "dm_permission": true,
        "integration_types": [
            1
        ],
        "options": [
            {
                "type": 3,
                "name": "status",
                "description": "/",
                "required": true
            },
            {
                "type": 11,
                "name": "image0",
                "description": "/"
            },
                        {
                "type": 11,
                "name": "image1",
                "description": "/"
            },
                        {
                "type": 11,
                "name": "image2",
                "description": "/"
            },
                        {
                "type": 11,
                "name": "image3",
                "description": "/"
            },
            {
                "type": 4,
                "name": "user",
                "description": "/"
            }
        ],
        "nsfw": false
    }
];

const rest = new REST({ version: "10" }).setToken(token);

// Define the intents your bot needs
export const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once(Events.ClientReady, async () => {
    console.log(`${client.user?.tag} でログインしました。`);
    // try {
    //     await rest.put(Routes.applicationCommands(client.user?.id || ""), {
    //         body: commands,
    //     });
    //     console.log("アプリケーションコマンドを登録しました。");
    // } catch (error) {
    //     console.error(error);
    // }
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand() || (interaction.user.id !== "310554809910558720")) return;
    console.log(interaction.commandName);
    switch (interaction.commandName) {
        case "xoauth2":
            // await interaction.reply(XApp.generateOAuth2AuthLink("http://localhost", {scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access']}).url)
            break;
        case "xverify":
            // await interaction.reply("xverify command executed.")
            break;
        case "x":
            x(interaction);
            break;
        default:
            await interaction.reply("❓ コマンドが見つかりません。");
            break;
    }
});

client.login(token);
