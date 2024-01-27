import { ActionRowBuilder, ApplicationCommandOptionType, AutocompleteInteraction, BaseGuildTextChannel, ChatInputCommandInteraction, Embed, EmbedBuilder, ModalBuilder, PermissionFlagsBits, TextInputBuilder, TextInputStyle } from "discord.js";
import { CustomClient } from "../index.js";
import  SuggestData  from "../models/suggest.js";
import Config from "../config.js";
import config from "../config.js";
export default {
	name: "suggest",
	description: "suggest",
	permissions: [""],
	roleRequired: "", // id here
	cooldown: 0, // in ms
	function: async function ({client, interaction }: { client : CustomClient,interaction: ChatInputCommandInteraction }) {
                let suggestionModal = new ModalBuilder()
                .setTitle("Suggestion")
                .setCustomId("suggestion-modal")
                .setComponents(
                    new ActionRowBuilder<TextInputBuilder>().setComponents(
                        new TextInputBuilder()
                        .setLabel("Suggestion")
                        .setCustomId("suggestion")
                        .setPlaceholder("Suggestion")
                        .setRequired(true)
                        .setStyle(TextInputStyle.Paragraph)
                        .setMinLength(1)
                    )
                )

                await interaction.showModal(suggestionModal)
                let modalSubmitted = await interaction.awaitModalSubmit({time : 120000 , filter : (i) => i.customId == "suggestion-modal" && i.user.id == interaction.user.id})
                if (!modalSubmitted) return interaction.followUp({content : "Time out!", ephemeral : true})
                let suggestion = modalSubmitted.fields.getField("suggestion").value
                if (!suggestion) return modalSubmitted.reply({content : "You need to provide a suggestion!", ephemeral : true})
                let suggestionLength = (await SuggestData.find({guildId : interaction.guildId})).length
                await modalSubmitted.reply({content : "Suggestion submitted!", ephemeral : true})
                let suggestionEmbed = new EmbedBuilder()
                .setColor("LightGrey")
                .setTitle("Suggestion Request")
                .setFields(
                    {name : "Author", value : `<@${interaction.user.id}>`, inline : false},
                    {name : "Suggestion", value : `\`\`\`\n${suggestion}\n\`\`\``, inline : false}
                    )
                .setTimestamp()
                .setFooter({text : `Suggestion ID : ${(suggestionLength)} | Stutus : Pending ` , iconURL : interaction.guild.iconURL()})
                let suggestionChannel = interaction.guild.channels.cache.get(config.adminChannel) as BaseGuildTextChannel
                if (!suggestionChannel) return;
                let msg = await suggestionChannel.send({embeds : [suggestionEmbed]})
                await SuggestData.create({ guildId : interaction.guildId, suggestion : suggestion, suggestionId : (suggestionLength), authorId : interaction.user.id , embedID : msg.id})  

	},
	autocomplete: async function({ interaction }: { interaction: AutocompleteInteraction }) {
        if (!interaction.inCachedGuild()) return;
    }
};

