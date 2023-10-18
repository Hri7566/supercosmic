import { Command } from "../../Command";

export const help = new Command(
	"help",
	["help", "h", "commands", "cmds"],
	"get help bozo",
	"{prefix}help",
	(msg, agent) => {
		return "test";
	}
);
