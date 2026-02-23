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
            const contentType = image.contentType?.toLowerCase() || "";

            if (contentType.includes("png")) {
                mediaType = EUploadMimeType.Png;
            } else if (contentType.includes("jpeg") || contentType.includes("jpg")) {
                mediaType = EUploadMimeType.Jpeg;
            } else if (contentType.includes("gif")) {
                mediaType = EUploadMimeType.Gif;
            } else if (contentType.includes("webp")) {
                mediaType = EUploadMimeType.Webp;
            } else {
                await interaction.followUp({ content:`⚠️ [image${i}]\n${image.contentType}形式はサポートされていません。`, flags: MessageFlags.Ephemeral });
                continue;
            }

            const mediaId = await X.v1.uploadMedia(buffer, {
                mimeType: mediaType,
            });
            mediaIds.push(mediaId);
        } catch (error: any) {
            console.error(`Error uploading image ${i}:`, error);
            await interaction.followUp({content: `⚠️ [image${i}] アップロード中にエラーが発生しました。\n${error.message || error}`, flags: MessageFlags.Ephemeral});
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
