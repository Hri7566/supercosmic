import { Command } from "../../Command";

export const about = new Command(
	"about",
	["about", "info"],
	"get about bozo",
	"about",
	(msg, agent) => {
		return `This is a dumb chat bot`;
	}
);
