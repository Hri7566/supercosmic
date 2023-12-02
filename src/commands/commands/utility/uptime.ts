import { MicroHandler } from "../../../services/console/MicroHandler";
import { padNum } from "../../../util/Logger";
import { Command } from "../../Command";

export const uptime = new Command(
	"uptime",
	["uptime", "up"],
	"get bot uptime bozo",
	"uptime",
	async (msg, agent) => {
		const ms = Math.floor(process.uptime() * 1000);

		const s = ms / 1000;
		const m = s / 60;
		const h = m / 60;

		const ss = padNum(Math.floor(s) % 60, 2, "0");
		const mm = padNum(Math.floor(m) % 60, 2, "0");
		const hh = padNum(Math.floor(h) % 24, 2, "0");
		const ll = padNum(ms % 1000, 3, "0");

		return `Uptime: ${hh}:${mm}:${ss}.${ll}`;
	}
);
