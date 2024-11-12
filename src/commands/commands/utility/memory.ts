import { Command } from "../../Command";

export const memory = new Command(
	"memory",
	["memory", "mem"],
	"get the memory bozo",
	"memory",
	() => {
		const mem = process.memoryUsage();

		return `${(mem.heapUsed / 1000 / 1000).toFixed(2)} MB / ${(
			mem.heapTotal /
			1000 /
			1000
		).toFixed(2)} MB / ${(mem.rss / 1000 / 1000).toFixed(2)} MB`;
	}
);
