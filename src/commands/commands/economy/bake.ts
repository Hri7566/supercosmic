import { formatBalance } from "../../../economy/Balance";
import { startBaking } from "../../../economy/baking";
import { Command } from "../../Command";

export const bake = new Command(
	"bake",
	["bake", "b", "startbaking", "bakecake", "oven"],
	"bozo's oven",
	"bake",
	(msg, agent) => {
		const agentId = globalThis.serviceLoader.getAgentId(agent);
		const message = startBaking(msg.user.id, agentId);
		return message;
	}
);
