import fs from "fs";
import path from "path";
import { client } from "../index.js";
import { fileURLToPath } from 'url';
import { convertURLs } from "../utils/windowsUrlConvertor.js";
import { log } from "../utils/logging.js";

export default {
	function: async function () {
		const __filename = fileURLToPath(import.meta.url);
		const __dirname = path.dirname(__filename);
		const load_dir = async (dirs: string) => {
			dirs = path.resolve(__dirname, `../events/${dirs}/`);
			if (!fs.existsSync(dirs))  return log(`Skipping ${dirs} because it doesn't exist`);
			const event_files = fs.readdirSync(dirs)
			log( `Loading ${event_files.length} events from ${dirs}`)
			for (const file of event_files) {
				if (file.endsWith(".js") || file.endsWith(".ts")) {
				const windowsDirs = convertURLs(dirs);
				const fileToImport = process.platform === "win32" ? `${windowsDirs}/${file}` : `${dirs}/${file}`;
				const event = await import(fileToImport);

				const event_name = event.default.name;
				if (event_name == "ready") {
					if (client.isReady()) {
						event.default.function();
						continue;
					}
				}
				if (event.default.once === true) client.once(event_name, event.default.function.bind(null));
				else client.on(event_name, event.default.function.bind(null));
			} else {
				if (fs.statSync(process.platform === "win32" ? `${(dirs)}\\${file}` : `${dirs}/${file}`).isDirectory()) {
					const directories = fs.readdirSync(process.platform === "win32" ? `${(dirs)}\\${file}` : `${dirs}/${file}`)
					directories.forEach(async file2 => {
						if (file2.endsWith(".js") || file2.endsWith(".ts")) {
							const windowsDirs = convertURLs(dirs);
							const fileToImport = process.platform === "win32" ? `${windowsDirs}/${file}/${file2}` : `${dirs}/${file}/${file2}`;
							const event = await import(fileToImport);

							const event_name = event.default.name;
							if (event_name == "ready") {
								if (client.isReady()) {
									event.default.function();
									return; // Fix: Replace 'continue' with 'return'
								}
							}
							if (event.default.once === true) client.once(event_name, event.default.function.bind(null));
							else client.on(event_name, event.default.function.bind(null));
						} else load_dir(`${dirs.split("\\")[dirs.split("\\").length-1]}/${file}/${file2}/`);
						
					});
					continue;
				}
			}
		}
		};
		["client", "guild"].forEach(async e => await load_dir(e));
	}
};
