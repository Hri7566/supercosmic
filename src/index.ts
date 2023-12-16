import { loadCommands, type CommandGroup } from "./commands";
import { CommandHandler } from "./commands/CommandHandler";
import { loadRoleConfig } from "./permissions";
import { ServiceLoader } from "./services";
import { ConsoleAgent } from "./services/console";
import { printStartupASCII } from "./util/ascii";

// Hot reload persistence
declare global {
	var loaded: boolean;
	var serviceLoader: any;
}

globalThis.loaded ??= false;
globalThis.serviceLoader ??= ServiceLoader;

function load() {
	printStartupASCII();
	loadRoleConfig();
	loadCommands();
	globalThis.serviceLoader.loadServices();

	globalThis.loaded = true;
}

function reload() {
	console.log("Reloading...");

	// Reload commands
	globalThis.commandHandler.commandGroups = new Array<CommandGroup>();
	loadCommands();

	// Set console prompt
	globalThis.serviceLoader.agents.forEach(agent => {
		if (agent.platform === "console")
			(agent as ConsoleAgent).client.prompt();
	});
}

// Check for hot reload
if (!globalThis.loaded) {
	load();
} else {
	console.clear();
	console.log("Hot reload triggered");
	reload();
}

export function scopedEval(code: string) {
	return eval(code);
}
