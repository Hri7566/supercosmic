import { Command } from "../../Command";

export const id = new Command(
	"id",
	["id"],
	"get your id bozo",
	"id",
	(msg, agent) => {
		if (agent.platform === "mpp") {
			return `ID: \`${
				(msg.originalMessage as any).p._id
			}\` Cosmic ID: \`${msg.p._id}\``;
		} else {
			return `Cosmic ID: \`${msg.p._id}\``;
		}
	}
);
