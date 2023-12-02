import { Command } from "../../Command";

export const msg = new Command(
	"msg",
	["msg"],
	"get your msg bozo",
	"msg",
	(msg, agent) => {
		if (agent.platform !== "mpp") return;
		return `${JSON.stringify(msg)}`;
	}
);
