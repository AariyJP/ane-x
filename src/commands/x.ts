import { ChatInputCommandInteraction, DMChannel, MessageFlags, NewsChannel, SendableChannels, TextChannel } from "discord.js";
import { XApp, XMe } from "../index.js";
import { EUploadMimeType, SendTweetV2Params } from "twitter-api-v2";

export const execute = async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    const status = interaction.options.getString("status")?.replace(";", "\n") || "";
    let statusUrl = `https://x.com/${XMe.data.username}/status/`;
    let mediaIds: string[] = [];
    for (let i = 0; i < 4; i++) {
        const image = interaction.options.getAttachment(`image${i}`);
        if (!image) continue;

        try {
            const response = await fetch(image.url);
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            let mediaType: EUploadMimeType;
            if (image.contentType === "image/png") {
                mediaType = EUploadMimeType.Png;
            } else if (image.contentType === "image/jpeg") {
                mediaType = EUploadMimeType.Jpeg;
            } else {
                await interaction.reply({ content:`⚠️ [image${i}]\n${image.contentType}形式はサポートされていません。`});
                continue;
            }
            const mediaId = await XApp.v2.uploadMedia(buffer, {
                media_type: mediaType,
            });
            mediaIds.push(mediaId);
        } catch (error) {
            await interaction.reply({content: `⚠️ [image${i}]\n${error}`});
            continue;
        }
    }
    const payload: SendTweetV2Params = {
        text: status,
    };
    if (mediaIds.length > 0) {
        payload.media = {
            media_ids: mediaIds.slice(0, 4) as [string] | [string, string] | [string, string, string] | [string, string, string, string],
        };
    }
    XApp.v2
        .tweet(payload)
        .then(async (p) => {
            statusUrl += p.data.id;
            //await interaction.editReply({ content: `✅ ${statusUrl}` });
            
            const channel = interaction.channel as TextChannel | NewsChannel | DMChannel;
            await channel.send(statusUrl);
            await interaction.deleteReply();
        })
        .catch(async (e) => {
            await interaction.editReply({ content: "❌ " + e.message });
        });
};
