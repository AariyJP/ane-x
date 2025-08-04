import { ChatInputCommandInteraction, MessageFlags, TextChannel } from "discord.js";
import { XApp } from "../index";

export const execute = async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    const status = interaction.options.getString("status")?.replace(";", "\n") || "";
    let statusUrl = `https://x.com/${XApp.currentUserV2.name}/status/`;
    XApp.v2.tweet(status)
    .then(async (p) => {
        statusUrl += p.data.id;
        await interaction.editReply({ content: `✅ ${statusUrl}` });
        const channel = interaction.channel as TextChannel;
        channel.send({content: statusUrl});
    })
    .catch(async (e) => {
        await interaction.editReply({ content: "❌ " + e.message });
    });

};