import { MPPAgent } from "../../../services/mpp";
import { Command } from "../../Command";

export const id = new Command(
	"id",
	["id"],
	"get your id bozo",
	"id",
	(msg, agent) => {
		if (!(agent as MPPAgent).client.isConnected) return;
		return `ID: \`${(msg.originalMessage as any).p._id}\``;
	},
	false
);
