import colors from "colors";
import { log } from "../../utils/logging.js";
import { client } from "../../index.js";
import { ContextMenuCommandInteraction } from "discord.js";

interface ContextMenuCommand {
    function: (params: {
        interaction: ContextMenuCommandInteraction;
        client : typeof client
    }) => void;
}

export default {
    name: "interactionCreate",
    once: false,
    function: async function (interaction: ContextMenuCommandInteraction) {
        if (!interaction.isContextMenuCommand()) return;

        const command = client.contextMenus.get(interaction.commandName) as ContextMenuCommand;
        if (command) {
            try {
                command.function({ client, interaction });
                log(
                    `[Context menu clicked] ${interaction.commandName} ${colors.blue("||")} Author: ${interaction.user.username} ${colors.blue("||")} ID: ${interaction.user.id
                    } ${colors.blue("||")} Server: ${interaction.guild!.name}`
                );
            } catch (error) {
                log(colors.red(error))
            }
         
        }
    },
} as any;
