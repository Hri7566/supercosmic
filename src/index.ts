import { loadCommands, CommandHandler, type CommandGroup } from "./commands";
import { loadRoleConfig } from "./permissions";
import { ServiceLoader } from "./services";
import { ConsoleAgent } from "./services/console";
import { printStartupASCII } from "./util/ascii";

declare global {
	var loaded: boolean;
	var serviceLoader: any;
	var commandHandler: any;
}

// Set on first run
globalThis.loaded ??= false;
globalThis.serviceLoader ??= ServiceLoader;
globalThis.commandHandler ??= CommandHandler;

function load() {
	printStartupASCII();
	loadRoleConfig();
	loadCommands();
	globalThis.serviceLoader.loadServices();

	globalThis.loaded = true;
}

// Check for hot reload
if (!globalThis.loaded) {
	load();
	console.log("Command list:", globalThis.commandHandler.commandGroups);
} else {
	console.log("Hot reload triggered...");
	// Set console prompt
	globalThis.serviceLoader.agents.forEach(agent => {
		if (agent.platform === "console")
			(agent as ConsoleAgent).client.prompt();
	});

	// Reload commands
	globalThis.commandHandler.commandGroups = new Array<CommandGroup>();
	loadCommands();

	console.log("Command list:", globalThis.commandHandler.commandGroups);
}

export function scopedEval(code: string) {
	return eval(code);
}
