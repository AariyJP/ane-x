import { ChatInputCommandInteraction, DMChannel, MessageFlags, NewsChannel, SendableChannels, TextChannel } from "discord.js";
import { XApp, XApp1 } from "../index.js";
import { EUploadMimeType, SendTweetV2Params, TwitterApi } from "twitter-api-v2";

export const execute = async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();
    const X: TwitterApi = (() => {
        switch (interaction.options.getInteger("user", false)) {
            case 0 :
                return XApp;
            case 1 :
                return XApp1;
            case null :
                return XApp;
            default:
                return XApp;
        }
    })();
    const status = interaction.options.getString("status")?.replace(";", "\n") || "";
    let statusUrl = `https://x.com/${(await X.currentUserV2()).data.username}/status/`;
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
                // await interaction.followUp({ content:`⚠️ [image${i}]\n${image.contentType}形式はサポートされていません。`, flags: MessageFlags.Ephemeral });
                continue;
            }
            const mediaId = await X.v1.uploadMedia(buffer, {
                mimeType: mediaType,
            });
            mediaIds.push(mediaId);
        } catch (error) {
            console.error(`Error uploading image ${i}:`, error);
            // await interaction.followUp({content: `⚠️ [image${i}]\n${error}`, flags: MessageFlags.Ephemeral});
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
    X.v2
        .tweet(payload)
        .then(async (p) => {
            statusUrl += p.data.id;
            //await interaction.editReply({ content: `✅ ${statusUrl}` });
            
            const channel = interaction.channel as TextChannel | NewsChannel | DMChannel;
            if (channel == null) {
                await interaction.editReply({ content: statusUrl });
            }
            else {
                await channel.send(statusUrl);
                await interaction.deleteReply();
            }
        })
        .catch(async (e) => {
            await interaction.editReply({ content: "❌ " + e.message });
        });
};
