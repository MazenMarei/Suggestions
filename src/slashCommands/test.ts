import { ApplicationCommandOptionType, AutocompleteInteraction, ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { CustomClient } from "../index.js";

export default {
	name: "test",
	description: "testing",
	permissions: ["Administrator"],
	roleRequired: "", // id here
	cooldown: 0, // in ms
	options: [{ name: "what", description: "you want what?", required: false, type: ApplicationCommandOptionType.String }],
	function: async function ({client, interaction }: { client : CustomClient,interaction: ChatInputCommandInteraction }) {
		let guiilds = client.db.get("guildTsConfig")
        let data = guiilds.find((e:any) => e.guildId == interaction.guildId)
        interaction.reply("test prefix is: "+data.prefix);
	},
	autocomplete: async function({ interaction }: { interaction: AutocompleteInteraction }) {
        if (!interaction.inCachedGuild()) return;

        const focusedOption = interaction.options.getFocused(true);
        const focusedValue = interaction.options.getFocused();

        if (focusedOption.name === "item") {
            if (interaction.member.permissions.has(PermissionFlagsBits.Administrator))  {
                return interaction.respond([{
                    name: "All items",
                    value: "all"
                }]);
            } else {   
				function getLatestItems() {
					return []
				}
                const choices = getLatestItems();
                const filtered = choices.filter((choice) => choice.toLowerCase().includes(focusedValue.toLowerCase()));
                
                await interaction.respond(filtered.map((choice) => ({ name: choice, value: choice })));
            }
        }
    }
};

