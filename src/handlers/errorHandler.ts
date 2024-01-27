import fs from "fs";
import path from "path";
import { client } from "../index.js";
import { fileURLToPath } from 'url';
import { convertURLs } from "../utils/windowsUrlConvertor.js";

export default {
	/**
	 * @description Registers all the commands, context menus, buttons, modals and select menus
	 * @author tako
	 * 
	 * Also, I'm sure this is the worst way to do this, but it works
	 */
	init: async function () {
		const dirs = ["errorHandler"];
		for (const dir of dirs) {
			await register(dir).catch(err => null);;
		}
	}
};

/**
 * @param { String } dir - The directory to register
 */
async function register(dir: string) {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);

	const dirName = dir;
	dir = path.resolve(__dirname, `../${dir}/`);
	const files = fs.readdirSync(dir);

	for (const file of files) {
		if (file.endsWith(".js") || file.endsWith(".ts")) {
			const fileToImport = process.platform === "win32" ? `${convertURLs(dir)}/${file}` : `${dir}/${file}`;
            import(fileToImport)
		} else {
			if (fs.statSync(process.platform === "win32" ? `${(dir)}\\${file}` : `${dir}/${file}`).isDirectory()) {
				const directories = fs.readdirSync(process.platform === "win32" ? `${(dir)}\\${file}` : `${dir}/${file}`)
				directories.forEach(async file2 => {
					if (file2.endsWith(".js") || file2.endsWith(".ts")) {
						const fileToImport = process.platform === "win32" ? `${convertURLs(dir)}/${file}/${file2}` : `${dir}/${file}/${file2}`;
                        import(fileToImport)
					}
				});
				continue;
			} else {
				[`${dirName}/${file}`].forEach(async (e: string) => await register(e));
			}
		}
	}
}
