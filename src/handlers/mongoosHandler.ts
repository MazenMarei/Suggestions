import fs from "fs";
import path from "path";
import { client } from "../index.js";
import { fileURLToPath } from 'url';
import { convertURLs } from "../utils/windowsUrlConvertor.js";
import guild from "../models/guild.js";
import { log } from "../utils/logging.js";

export default  {
	func : async function () {
		const __filename = fileURLToPath(import.meta.url);
		const __dirname = path.dirname(__filename);
		const load_dir = async (dirs: string , dirs2?:string) => {
			dirs = path.resolve(__dirname, `../events/${dirs}/${dirs2?dirs2+"/":""}`)				
				if (!fs.existsSync(dirs+"\\"))  return log(`Skipping ${dirs} because it doesn't exist`);
				const event_files = fs.readdirSync(dirs)
				log( `Loading ${event_files.length} events from ${dirs}`)
				for (const file of event_files) {
					if (file.endsWith(".js") || file.endsWith(".ts")) {
					const windowsDirs = convertURLs(dirs);
					const fileToImport = process.platform === "win32" ? `${windowsDirs}/${file}` : `${dirs}/${file}`;
					const event = await import(fileToImport);
	
					const event_name = event.default.name;
					if (event.default.once === true) event.default.model.watch().once(event_name , event.default.function.bind(null))
					else event.default.model.watch().on(event_name , event.default.function.bind(null))
					} else {
						if (fs.statSync(process.platform === "win32" ? `${(dirs)}\\${file}` : `${dirs}/${file}`).isDirectory()) {
							const directories = fs.readdirSync(process.platform === "win32" ? `${(dirs)}\\${file}` : `${dirs}/${file}`)
							directories.forEach(async file2 => {
								if (file2.endsWith(".js") || file2.endsWith(".ts")) {
									const windowsDirs = convertURLs(dirs);
									const fileToImport = process.platform === "win32" ? `${windowsDirs}/${file}/${file2}` : `${dirs}/${file}/${file2}`;
									
									const event = await import(fileToImport);
	
									const event_name = event.default.name;
									if (event.default.once === true) event.default.model.watch().once(event_name , event.default.function.bind(null))
									else event.default.model.watch().on(event_name , event.default.function.bind(null))
								} else {
									["mongoos/"+file+"/"+file2].forEach(async (e:string) => await load_dir(e));
								}
							});
							continue;
						}
					}
					
				}
		};
		["mongoos"].forEach(async  (e:string)  => await load_dir(e));
	},
}

