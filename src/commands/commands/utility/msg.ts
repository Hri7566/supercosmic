import { MPPAgent } from "../../../services/mpp";
import { Command } from "../../Command";

export const msg = new Command(
	"msg",
	["msg"],
	"get your msg bozo",
	"msg",
	(msg, agent) => {
		if (!(agent as MPPAgent).client.isConnected) return;
		return `${JSON.stringify(msg)}`;
	},
	false
);
