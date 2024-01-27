import { ApplicationCommandOptionType, AutocompleteInteraction, ChatInputCommandInteraction, EmbedBuilder, GuildTextBasedChannel, ModalBuilder, PermissionFlagsBits } from "discord.js";
import { CustomClient } from "../../index.js";
import config from "../../config.js";
import suggest from "../../models/suggest.js";
export default {
    name : "implement",
	description: "implement",
	permissions: [""],
	roleRequired: "", // id here
	cooldown: 0, // in ms
	function: async function ({client, interaction }: { client : CustomClient,interaction: ChatInputCommandInteraction }) {
        let suggestionId = interaction.options.getString("id")
        let suggestionData = (client.db.get("suggest"))!.find(a=> a.guildId == interaction.guildId && a.suggestionId == suggestionId)
        if (!suggestionData) return interaction.reply({content : "Invalid suggestion ID!", ephemeral : true})
        let msg = await (await interaction.guild.channels.fetch(config.adminChannel , {force : true}) as GuildTextBasedChannel).messages.fetch(suggestionData.embedID)
        let suggestionEmbed = new EmbedBuilder(msg.embeds[0]).setColor("Yellow").setFooter({text : `Suggestion ID : ${suggestionId} | Stutus : implemented | implemented by ${interaction.user.username}` , iconURL : interaction.guild.iconURL()})
        await msg.edit({embeds : [suggestionEmbed]})
        if (suggestionData.status !== "accepted") return interaction.reply({content : "Suggestion has to be accepted before it implemented", ephemeral : true})
        let suggestionChannel = await interaction.guild.channels.fetch(config.suggesttChannel , {force : true}) as GuildTextBasedChannel;
        let suggestionEmmbed2 = new EmbedBuilder()
        .setColor("Green")
        .setTitle("Suggestion")
        .setFields(
            {name : "Author", value : `<@${suggestionData.authorId}>`, inline : false},
            {name : "Suggestion", value : `\`\`\`\n${suggestionData.suggestion}\n\`\`\``, inline : false}
            )
        .setTimestamp()
        await interaction.reply({content : "Suggestion implemented!", ephemeral : true})
        await suggestionChannel.send({embeds : [suggestionEmmbed2]})

	},
	autocomplete: async function({ interaction }: { interaction: AutocompleteInteraction }) {
        if (!interaction.inCachedGuild()) return;
    }
};

