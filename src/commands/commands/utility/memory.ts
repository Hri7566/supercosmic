import { Command } from "../../Command";

export const memory = new Command(
	"memory",
	["memory", "mem"],
	"get the memory bozo",
	"memory",
	() => {
		return `${(process.memoryUsage().heapUsed / 1000 / 1000).toFixed(
			2
		)} MB used / ${(process.memoryUsage().heapTotal / 1000 / 1000).toFixed(
			2
		)} MB total`;
	}
);
