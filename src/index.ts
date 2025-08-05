import { REST, Routes, Client, Events, GatewayIntentBits, SlashCommandBuilder, ApplicationIntegrationType, MessageFlags } from "discord.js";
import { TwitterApi } from "twitter-api-v2";
import dotenv from "dotenv";
import { execute as x } from "./commands/x";

dotenv.config();

// Map to store user tokens
const userTokens: Map<string, { oauth_token: string; oauth_token_secret: string }> = new Map();

const token = process.env.DISCORD_BOT_TOKEN || "";
const xtoken = process.env.X_BEARER_TOKEN || "";
const clientId = process.env.X_CLIENT_ID || "";
const clientSecret = process.env.X_CLIENT_SECRET || "";
const appKey = process.env.X_APP_KEY || "";
const appSecret = process.env.X_APP_SECRET || "";
const accessToken = process.env.X_ACCESS_TOKEN || "";
const accessSecret = process.env.X_ACCESS_SECRET || "";

process.on("uncaughtException", (err) => {
    console.error(err);
});

// const XApp = new TwitterApi({ clientId: clientId, clientSecret: clientSecret });
export const XApp = new TwitterApi({
    appKey: appKey,
    appSecret: appSecret,
    accessToken: accessToken,
    accessSecret: accessSecret,
});

const commands = [
    new SlashCommandBuilder()
        .setName("x")
        .setDescription("x")
        .addStringOption((option) => option.setName("status").setDescription("/").setRequired(true))
        .addAttachmentOption((option) => option.setName("image0").setDescription("/"))
        .addAttachmentOption((option) => option.setName("image1").setDescription("/"))
        .addAttachmentOption((option) => option.setName("image2").setDescription("/"))
        .addAttachmentOption((option) => option.setName("image3").setDescription("/"))
        .addIntegerOption((option) => option.setName("user").setDescription("/"))
        .setDefaultMemberPermissions(0)
        .setIntegrationTypes(ApplicationIntegrationType.UserInstall)
        .toJSON(),
    new SlashCommandBuilder()
        .setName("xoauth")
        .setDescription("/")
        .setDefaultMemberPermissions(0)
        .setIntegrationTypes(ApplicationIntegrationType.UserInstall)
        .toJSON(),
    new SlashCommandBuilder()
        .setName("xoauth2")
        .setDescription("/")
        .setDefaultMemberPermissions(0)
        .setIntegrationTypes(ApplicationIntegrationType.UserInstall)
        .toJSON(),
    new SlashCommandBuilder()
        .setName("xverify")
        .setDescription("/")
        .setDefaultMemberPermissions(0)
        .setIntegrationTypes(ApplicationIntegrationType.UserInstall)
        // .addStringOption((option) => option.setName("oauth_token").setDescription("/").setRequired(true))
        // .addStringOption((option) => option.setName("oauth_token_secret").setDescription("/").setRequired(true))
        .addStringOption((option) => option.setName("oauth_verifier").setDescription("/").setRequired(true))
        .toJSON(),
    new SlashCommandBuilder()
        .setName("register-commands")
        .setDescription("/")
        .setDefaultMemberPermissions(0)
        .setIntegrationTypes(ApplicationIntegrationType.UserInstall)
        .toJSON(),
];
console.log(`\n${JSON.stringify(commands)}\n`);

const rest = new REST({ version: "10" }).setToken(token);

// Define the intents your bot needs
export const client = new Client({
    intents: [],
});

client.once(Events.ClientReady, async () => {
    console.log(`${client.user?.tag} でログインしました。`);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand() || interaction.user.id !== "310554809910558720") return;
    console.log(interaction.commandName);
    switch (interaction.commandName) {
        case "register-commands":
            interaction.deferReply({ flags: MessageFlags.Ephemeral });
            try {
                await rest.put(Routes.applicationCommands(client.user?.id || ""), {
                    body: commands,
                });
                await interaction.editReply({ content: "✅ コマンドを登録しました。" });
            } catch (error) {
                await interaction.editReply({ content: `${error}` });
            }
            return;
        case "xoauth":
            let authLink = await XApp.generateAuthLink("http://localhost");
            // Store the tokens in the map
            userTokens.set(interaction.user.id, {
                oauth_token: authLink.oauth_token,
                oauth_token_secret: authLink.oauth_token_secret,
            });
            await interaction.reply({
                content: `${authLink.url}\n\`\`\`\n${authLink.oauth_token}\n${authLink.oauth_token_secret}\`\`\``,
                flags: MessageFlags.Ephemeral,
            });
            return;
        case "xverify":
            if(!userTokens.has(interaction.user.id)) {
                await interaction.reply({
                    content: "❌ `/xoauth`コマンドを実行してトークンを取得してください。",
                    flags: MessageFlags.Ephemeral,
                })
                return
            };
            new TwitterApi({
                appKey: appKey,
                appSecret: appSecret,
                accessToken: userTokens.get(interaction.user.id)?.oauth_token,
                accessSecret: userTokens.get(interaction.user.id)?.oauth_token_secret,
            })
            .login(interaction.options.getString("oauth_verifier") || "")
            .then(async (result) => {
                await interaction.reply({
                    content: `\`\`\`\n${JSON.stringify(result.client.getActiveTokens())}\`\`\``,
                    flags: MessageFlags.Ephemeral,
                });
            }
            ).catch(async (error) => {
                await interaction.reply({
                    content: `❌ ${error}`,
                    flags: MessageFlags.Ephemeral,
                });
            });
            return;
        case "x":
            x(interaction);
            return;
        default:
            await interaction.reply({ content: "❓ コマンドが見つかりません。", flags: MessageFlags.Ephemeral });
            return;
    }
});

client.login(token);
