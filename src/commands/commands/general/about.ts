import { Command } from "../../Command";

export const help = new Command(
	"about",
	["about", "info"],
	"get about bozo",
	"{prefix}about",
	(msg, agent) => {
		return `This is a dumb chat bot`;
	}
);
