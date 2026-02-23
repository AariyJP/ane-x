import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';
dotenv.config();

// ツイート投稿API(v2.tweet)だけを差し替えた実際のTwitterClientを生成する
vi.mock('../index.js', async (importOriginal) => {
    // 自身でdotenvを読み込み設定
    const dotenv = await import('dotenv');
    dotenv.config();
    const { TwitterApi } = await import('twitter-api-v2');

    const app = new TwitterApi({
        appKey: process.env.X_APP_KEY || "",
        appSecret: process.env.X_APP_SECRET || "",
        accessToken: process.env.X_ACCESS_TOKEN || "",
        accessSecret: process.env.X_ACCESS_SECRET || "",
    });

    // 「postはしないで」という要望に応えるためtweet関数だけモックにすり替え
    app.v2.tweet = vi.fn().mockResolvedValue({ data: { id: 'mock_tweet_id' } }) as any;
    
    // XApp1用にもう一つのモックアプリを作成
    const app1 = new TwitterApi({
        appKey: process.env.X_APP_KEY || "",
        appSecret: process.env.X_APP_SECRET || "",
        accessToken: process.env.X_ACCESS_TOKEN || "",
        accessSecret: process.env.X_ACCESS_SECRET || "",
    });
    app1.v2.tweet = vi.fn().mockResolvedValue({ data: { id: 'mock_tweet_id_1' } }) as any;

    return {
        XApp: app,
        XApp1: app1
    };
});

import { execute as xCommand } from './x.js';
import { XApp, XApp1 } from '../index.js';
import { MessageFlags } from 'discord.js';

describe('X Command (/x)', () => {
    let mockInteraction: any;

    beforeEach(() => {
        // DiscordのInteractionのモックを作成
        mockInteraction = {
            deferReply: vi.fn(),
            editReply: vi.fn(),
            followUp: vi.fn(),
            deleteReply: vi.fn(),
            channel: {
                send: vi.fn().mockResolvedValue(true)
            },
            options: {
                getInteger: vi.fn().mockReturnValue(0), // user: 0 (XApp)
                getString: vi.fn().mockReturnValue('Hello Real API!'), // status
                getAttachment: vi.fn((key: string) => {
                    if (key === 'image0') {
                        return {
                            url: 'https://example.com/mock.png',
                            contentType: 'image/png'
                        };
                    }
                    return null;
                })
            }
        };

        // 仮想の画像URLからダウンロードされる処理をモック
        global.fetch = vi.fn().mockImplementation(async (url) => {
            if (url === 'https://example.com/mock.png') {
                // 1x1ピクセルの透明なPNGデータのバッファ
                const b = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", "base64");
                // Buffer.bufferはプール全体を含むため、正確なArrayBufferを切り出して返す
                const actualArrayBuffer = new Uint8Array(b).buffer;
                return {
                    arrayBuffer: async () => actualArrayBuffer
                } as any;
            }
            throw new Error(`Unexpected URL: ${url}`);
        });
    });

    it('should actually upload an image to X but mock the status post', async () => {
        // テスト前に何回呼ばれたかをリセット
        vi.clearAllMocks();

        // 実際の`execute`（x.tsの処理）を実行
        await xCommand(mockInteraction);

        // --- アサーション（検証） ---

        // 1. ツイート投稿API (v2.tweet) が画像ID付きで呼ばれているか？
        expect((XApp as any).v2.tweet).toHaveBeenCalledTimes(1);
        
        const tweetCallArgs = ((XApp as any).v2.tweet as ReturnType<typeof vi.fn>).mock.calls[0][0];
        
        // ツイートのテキストが合っているか
        expect(tweetCallArgs.text).toBe('Hello Real API!');
        
        // media_ids が1つ以上渡されているか（画像が実際にTwitterAPIにアップロードされたという証拠）
        expect(tweetCallArgs.media).toBeDefined();
        expect(tweetCallArgs.media.media_ids.length).toBe(1);
        
        // 数値19桁程度の文字列である程度の検証
        expect(tweetCallArgs.media.media_ids[0]).toMatch(/^\d+$/);
        
        // 2. DiscordへのURL返信が行われたか
        expect(mockInteraction.channel.send).toHaveBeenCalledTimes(1);
        const sendArg = mockInteraction.channel.send.mock.calls[0][0];
        expect(sendArg).toMatch(/status\/mock_tweet_id$/); // URL末尾がモックのIDになる
    });

    it('should handle different image content types (png, jpg, gif, webp)', async () => {
        vi.clearAllMocks();

        // 実際のAPIへのアップロードを避けるため、gifとwebpの場合はuploadMediaを個別にモックする
        const originalUploadMedia = XApp.v1.uploadMedia.bind(XApp.v1);
        XApp.v1.uploadMedia = vi.fn().mockImplementation(async (file, options) => {
            if (options.mimeType === 'image/gif' || options.mimeType === 'image/webp') {
                return 'mock_media_id_special';
            }
            return originalUploadMedia(file, options);
        }) as any;

        const attachments: Record<string, { url: string; contentType: string }> = {
            'image0': { url: 'https://example.com/image.png', contentType: 'image/png' },
            'image1': { url: 'https://example.com/image.jpg', contentType: 'image/jpeg' },
            'image2': { url: 'https://example.com/image.gif', contentType: 'image/gif' },
            'image3': { url: 'https://example.com/image.webp', contentType: 'image/webp' },
        };

        mockInteraction.options.getAttachment = vi.fn((key: string) => attachments[key] || null);

        global.fetch = vi.fn().mockImplementation(async (url: string) => {
            const b = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", "base64");
            const actualArrayBuffer = new Uint8Array(b).buffer;
            return {
                arrayBuffer: async () => actualArrayBuffer
            } as any;
        });

        await xCommand(mockInteraction);

        expect((XApp as any).v2.tweet).toHaveBeenCalledTimes(1);
        const tweetCallArgs = ((XApp as any).v2.tweet as ReturnType<typeof vi.fn>).mock.calls[0][0];
        
        expect(tweetCallArgs.media).toBeDefined();
        // 4つの画像がすべてアップロードされていることを確認
        expect(tweetCallArgs.media.media_ids.length).toBe(4);

        // モックを元に戻す
        XApp.v1.uploadMedia = originalUploadMedia;
    });

    it('should use XApp1 and mock the status post when user parameter is 1', async () => {
        vi.clearAllMocks();

        // ユーザーオプションを 1 に変更
        mockInteraction.options.getInteger.mockReturnValue(1);

        // コマンドを実行
        await xCommand(mockInteraction);

        // --- アサーション（検証） ---

        // XApp (user 0) は呼ばれていないはず
        expect((XApp as any).v2.tweet).not.toHaveBeenCalled();

        // XApp1 (user 1) が呼ばれているはず
        expect((XApp1 as any).v2.tweet).toHaveBeenCalledTimes(1);
        
        const tweetCallArgs = ((XApp1 as any).v2.tweet as ReturnType<typeof vi.fn>).mock.calls[0][0];
        expect(tweetCallArgs.text).toBe('Hello Real API!');
        
        // 返信されたURLの末尾が XApp1 用の mock_tweet_id_1 になっているかを検証
        expect(mockInteraction.channel.send).toHaveBeenCalledTimes(1);
        const sendArg = mockInteraction.channel.send.mock.calls[0][0];
        expect(sendArg).toMatch(/status\/mock_tweet_id_1$/); 
    });
});
