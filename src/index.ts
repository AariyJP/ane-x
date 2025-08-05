import { REST, Routes, Client, Events, GatewayIntentBits, SlashCommandBuilder, ApplicationIntegrationType, MessageFlags } from "discord.js";
import { TwitterApi } from "twitter-api-v2";
import dotenv from "dotenv";
import { execute as x } from "./commands/x";
import { commands } from "./commands/builder";

// プロセス初期化

dotenv.config();
process.on("uncaughtException", (err) => {
    console.error(err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

// X初期化

const bearerToken = process.env.X_BEARER_TOKEN || "";
const clientId = process.env.X_CLIENT_ID || "";
const clientSecret = process.env.X_CLIENT_SECRET || "";
const appKey = process.env.X_APP_KEY || "";
const appSecret = process.env.X_APP_SECRET || "";
const accessToken = process.env.X_ACCESS_TOKEN || "";
const accessSecret = process.env.X_ACCESS_SECRET || "";

export const XApp = new TwitterApi({
    appKey: appKey,
    appSecret: appSecret,
    accessToken: accessToken,
    accessSecret: accessSecret,
});

// Discord初期化

const botToken = process.env.DISCORD_BOT_TOKEN || "";

const userTokens: Map<string, { oauth_token: string; oauth_token_secret: string }> = new Map();

export const DApp = new Client({
    intents: [GatewayIntentBits.Guilds],
});

DApp.once(Events.ClientReady, async () => {
    console.log(`${DApp.user?.tag} でログインしました。`);
});

DApp.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand() || interaction.user.id !== "310554809910558720") return;
    console.log(interaction.commandName);
    switch (interaction.commandName) {
        case "register-commands":
            interaction.deferReply({ flags: MessageFlags.Ephemeral });
            try {
                await new REST({ version: "10" }).setToken(botToken).put(Routes.applicationCommands(DApp.user?.id || ""), {
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

DApp.login(botToken);
