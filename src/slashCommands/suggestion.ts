import { ActionRowBuilder, ApplicationCommandOptionType, AutocompleteInteraction, ChatInputCommandInteraction, Embed, EmbedBuilder, ModalBuilder, PermissionFlagsBits, TextInputBuilder, TextInputStyle } from "discord.js";
import { CustomClient } from "../index.js";
import  SuggestData  from "../models/suggest.js";
import Config from "../config.js";
import config from "../config.js";
export default {
	name: "suggestion",
	description: "suggest",
	permissions: ["ADMINISTRATOR"],
	roleRequired: "", // id here
	cooldown: 0, // in ms
	options: [
        { name : "accept", description: "accept a suggestion",  type: ApplicationCommandOptionType.Subcommand, options : [
            {name : "id", description : "suggestion ID", type : ApplicationCommandOptionType.String, required : true},
        ] },
        { name : "deny", description: "deny a suggestion",  type: ApplicationCommandOptionType.Subcommand, options : [
            {name : "id", description : "suggestion ID", type : ApplicationCommandOptionType.String, required : true},
        ] },
        { name : "implement", description: "implement a suggestion",  type: ApplicationCommandOptionType.Subcommand, options : [
            {name : "id", description : "suggestion ID", type : ApplicationCommandOptionType.String, required : true},
        ] },
    ],
	function: async function ({client, interaction }: { client : CustomClient,interaction: ChatInputCommandInteraction }) {
        let Subcommand = interaction.options.getSubcommand();
        switch (Subcommand) {
            case "accept":
                (await import("./suggest-sub/accept.js")).default.function({client, interaction})
                break;
        
            case "deny":
                (await import("./suggest-sub/deny.js")).default.function({client, interaction})

                break;
            case "implement":
                (await import("./suggest-sub/implement.js")).default.function({client, interaction})

                break;
        }
    
	},
	autocomplete: async function({ interaction }: { interaction: AutocompleteInteraction }) {
        if (!interaction.inCachedGuild()) return;
    }
};

