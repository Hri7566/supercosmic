import { loadConfig } from "./config";
import { readFileSync } from "fs";
import pkg from "../../package.json";

const config = loadConfig("config/ascii.yml", {
	path: "config/ascii.txt"
});

export function printStartupASCII() {
	const data = readFileSync(config.path);

	// To make a compromise with PM2's logs,
	// we will attempt to write every line
	// with a color character so the entire
	// file is printed in color.
	for (const line of data.toString().split("\n")) {
		process.stdout.write(`\x1b[35m${line}\x1b[0m\n`);
	}

	// Print version info
	process.stdout.write(`\x1b[35mv${pkg.version}\x1b[0m\n`);
}
