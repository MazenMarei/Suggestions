import { ApplicationCommandOptionType, AutocompleteInteraction, ChatInputCommandInteraction, EmbedBuilder, GuildTextBasedChannel, ModalBuilder, PermissionFlagsBits } from "discord.js";
import { CustomClient } from "../../index.js";
import config from "../../config.js";
import suggest from "../../models/suggest.js";
export default {
    name : "deny",
	description: "deny",
	permissions: [""],
	roleRequired: "", // id here
	cooldown: 0, // in ms
	function: async function ({client, interaction }: { client : CustomClient,interaction: ChatInputCommandInteraction }) {
        let suggestionId = interaction.options.getString("id")
        let suggestionData = (client.db.get("suggest"))!.find(a=> a.guildId == interaction.guildId && a.suggestionId == suggestionId)
        if (!suggestionData) return interaction.reply({content : "Invalid suggestion ID!", ephemeral : true})
        if(suggestionData.status !== "pending") return interaction.reply({content : "Suggestion has to be pending before it accepted", ephemeral : true})
        await interaction.reply({content : "Suggestion denied!", ephemeral : true})
        let msg = await (await interaction.guild.channels.fetch(config.adminChannel , {force : true}) as GuildTextBasedChannel).messages.fetch(suggestionData.embedID)
        let suggestionEmbed = new EmbedBuilder(msg.embeds[0]).setColor("Red").setFooter({text : `Suggestion ID : ${suggestionId} | Stutus : Denied | Denied by ${interaction.user.username}` , iconURL : interaction.guild.iconURL()})
        await msg.edit({embeds : [suggestionEmbed]})
        await suggest.findOneAndUpdate({guildId : interaction.guildId , suggestionId : suggestionId}, {status : "denied", adminId : interaction.user.id})
	},
	autocomplete: async function({ interaction }: { interaction: AutocompleteInteraction }) {
        if (!interaction.inCachedGuild()) return;
    }
};

