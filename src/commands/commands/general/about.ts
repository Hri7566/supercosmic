import { Command } from "../../Command";

export const about = new Command(
	"about",
	["about", "info"],
	"get about bozo",
	"about",
	(msg, agent) => {
		return `💫 This space bot was made by Hri7566.\n🚀 This bot is made possible by users like you. Thank you.\n🌌 Discord: @hri7566`;
	}
);
