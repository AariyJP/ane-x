import { SlashCommandBuilder, ApplicationIntegrationType } from "discord.js";

export const commands = [
    new SlashCommandBuilder()
        .setName("x")
        .setDescription("/")
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
        .setName("oauth1")
        .setDescription("/")
        .setDefaultMemberPermissions(0)
        .setIntegrationTypes(ApplicationIntegrationType.UserInstall)
        .toJSON(),
    new SlashCommandBuilder()
        .setName("oauth2")
        .setDescription("/")
        .setDefaultMemberPermissions(0)
        .setIntegrationTypes(ApplicationIntegrationType.UserInstall)
        .toJSON(),
    new SlashCommandBuilder()
        .setName("verify1")
        .setDescription("/")
        .setDefaultMemberPermissions(0)
        .setIntegrationTypes(ApplicationIntegrationType.UserInstall)
        // .addStringOption((option) => option.setName("oauth_token").setDescription("/").setRequired(true))
        // .addStringOption((option) => option.setName("oauth_token_secret").setDescription("/").setRequired(true))
        .addStringOption((option) => option.setName("oauth_verifier").setDescription("/").setRequired(true))
        .toJSON(),
    new SlashCommandBuilder()
        .setName("register")
        .setDescription("/")
        .setDefaultMemberPermissions(0)
        .setIntegrationTypes(ApplicationIntegrationType.UserInstall)
        .toJSON(),
];