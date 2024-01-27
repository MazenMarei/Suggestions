// Package imports
import config from "./config.js";
import { error } from "./utils/logging.js";
import { Client, Collection, GatewayIntentBits, Partials } from "discord.js";
import  mongoose  from "mongoose"



// Define a new class that extends Client
export class CustomClient extends Client {
    cooldowns: any[] = [];
    commands: Collection<String, any> = new Collection<String, any>();
    slashCommands: Collection<String, any> = new Collection<String, any>();
    selectMenus: Collection<String, any> = new Collection<String, any>();
    modals: Collection<String, any> = new Collection<String, any>();
    contextMenus: Collection<String, any> = new Collection<String, any>();
    buttons: Collection<String, any> = new Collection<String, any>();
    db: Collection<(object | string | number | boolean), any[] > = new Collection();
}

// Initialize the extended client
export const client = new CustomClient({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    partials: [Partials.Message, Partials.GuildMember, Partials.Channel, Partials.Reaction, Partials.User]
});
// Command & event handlers
import eventHandler from "./handlers/eventHandler.js";
import idkHowToCallThisHandler from "./handlers/idkHowToCallThisHandler.js";
import mongoosHandler from "./handlers/mongoosHandler.js";
import errorHandler from "./handlers/errorHandler.js";

await idkHowToCallThisHandler.init();
eventHandler.function();
mongoosHandler.func()
errorHandler.init()
// Catching all the errors
process.on("uncaughtException", config.debugMode ? console.error : error);
process.on("unhandledRejection", config.debugMode ? console.error : error);

client.login(config.token);
mongoose.connect(config.Mongoose, )


