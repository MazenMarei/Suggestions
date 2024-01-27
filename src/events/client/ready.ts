import config from "../../config.js";
import colors from "colors";
import path from "path";
import { fileURLToPath } from 'url';
import { log, error } from "../../utils/logging.js";
import { client } from "../../index.js";
import { readdirSync, statSync } from "fs";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { convertURLs } from "../../utils/windowsUrlConvertor.js";
import { GuildManager } from "discord.js";
import mongoose from "mongoose";
import {ChangeStreamDocument , ChangeStreamInsertDocument , ChangeStreamUpdateDocument } from "mongodb";

interface Command {
	name: string;
	description: string;
	type: number;
	options: any[]; // You can replace "any" with the correct type for options
}

export default {
	name: "ready",
	description: "client ready event",
	once: false,
	function: async function () {
		log(`Logged in as ${colors.red(client.user!.tag)}`);

		const __filename = fileURLToPath(import.meta.url);
		const __dirname = path.dirname(__filename);

		const commands: Command[] = [];

		const registerDir = async (dirName: string) => {
			const COMMAND_DIR = path.resolve(__dirname, `../../${dirName}`);
			const readDir = async (dir: string) => {
				const files = readdirSync(dir);
				for await (const file of files) {
					if (statSync(`${dir}/${file}`).isDirectory()) await readDir(`${dir}/${file}`);
					else {
						const fileToImport = process.platform === "win32" ? `${convertURLs(dir)}/${file}` : `${dir}/${file}`;
						const command = (await import(fileToImport)).default;
						if (command?.name) {
							commands.push({
								name: command.name,
								type: command.type,
								description: command.description || null,
								options: command.options || null
							});
							log(`${dir}/${file} has been registered!`);
						} else {
							error(`${dir}/${file} has no name!`);
						}
					}
				}
			};
			await readDir(COMMAND_DIR);
		};

		await registerDir("slashCommands");
		await registerDir("contextMenus");
		// const rest = new REST({ version: '10' }).setToken(config.token);
		// rest
		// 	.put(Routes.applicationCommands(client.user!.id), { body: commands})
		// 	.then(() => log('Commands have been registered successfully!'))
		// 	.catch((err) => console.log(err));
		let guiilds = await client.guilds.fetch()
		for (let guildNum of guiilds) {
			let guild = await client.guilds.fetch(guildNum[0]);
			guild.commands.set(commands).catch((err) => console.log(err));
		}
		log('Commands have been registered successfully!')
		await mongoosToRam();
		log("Database has been Saved to ram successfully!");
	},
} as any;


async function mongoosToRam() {
	let mongoosModels = mongoose.modelNames();
	for (let model of mongoosModels) {
		let data:any[]= await mongoose.model(model).find().catch((err) => null);
		client.db.set(model, data);
		const connection = mongoose.connection;
		connection.on('drop', function(collection:ChangeStreamUpdateDocument<any>){
			log(`${collection} has been dropped and deleted from the ram!.`);
			client.db.delete(collection.ns.coll);
		});		
		connection.on("change" , function(collection:ChangeStreamUpdateDocument<any>){
			log(`${collection} has been changed and updated to the ram!.`);
		 })
		mongoose.model(model).watch().on('change', async (data:ChangeStreamUpdateDocument<any>) => { 
			let dataId = data.documentKey._id;
			let newData = data.fullDocument;
			let dataIndex = client.db.get(model).findIndex((e:any) => e._id.toString() == dataId._id.toString() );					
			if(data.operationType === "update") {
				Object.keys(data.updateDescription.updatedFields).forEach((key) => { 
					client.db.get(model)[dataIndex][key] = data.updateDescription.updatedFields[key];
				})
				log('Database has been updated to ram successfully!')
			} else if (data.operationType === "replace" ) {
				client.db.get(model)[dataIndex] = newData;
				log('Database has been replaced to ram successfully!')
			}else if(data.operationType === "insert") { 
				client.db.get(model).push(newData);
				log(`Database has been updated with new data!`)
			}  else if(data.operationType === "delete"){
				client.db.get(model).splice(dataIndex, 1);
				log('Database has been delete from ram successfully!')
			}
		})
		
	} 
}