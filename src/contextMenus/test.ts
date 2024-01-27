import { ApplicationCommandType } from "discord.js";
import { log } from "../utils/logging.js";
import { client } from "../index.js";
import type { CustomClient } from "../index.js"; // Import the 'CustomClient' type
import guild from "../models/guild.js";
export default {
    name: "test",
    type: ApplicationCommandType.Message,
    function: async function ({client,interaction }: { client : CustomClient , interaction: any }) {
        let guilds = client.db.get("guildTsConfig")        
        let data = guilds.find((e:any) => e.guildId == interaction.guildId)
        interaction.reply("test prefix is: "+data.prefix);
        await guild.findByIdAndUpdate(data._id,{prefix:"test2"})
    },
} as any;