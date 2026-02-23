import { TwitterApi, EUploadMimeType } from "twitter-api-v2";
import dotenv from "dotenv";
dotenv.config();
const XApp = new TwitterApi({
    appKey: process.env.X_APP_KEY || "",
    appSecret: process.env.X_APP_SECRET || "",
    accessToken: process.env.X_ACCESS_TOKEN || "",
    accessSecret: process.env.X_ACCESS_SECRET || "",
});
const buffer = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", "base64"); // 1x1 transparent PNG
async function testV2() {
    try {
        console.log("Testing V2 upload...");
        const mediaId = await XApp.v2.uploadMedia(buffer, { mime_type: "image/png" });
        console.log("V2 Success:", mediaId);
    }
    catch (e) {
        console.error("V2 Error:", e.message || e);
    }
}
async function testV1() {
    try {
        console.log("Testing V1 upload...");
        const mediaId = await XApp.v1.uploadMedia(buffer, { mimeType: EUploadMimeType.Png });
        console.log("V1 Success:", mediaId);
    }
    catch (e) {
        console.error("V1 Error:", e.message || e);
    }
}
async function run() {
    await testV2();
    await testV1();
}
run();
