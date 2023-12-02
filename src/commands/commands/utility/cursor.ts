import type { MPPAgent } from "../../../services/mpp";
import { Command } from "../../Command";

export const cursor = new Command(
	"cursor",
	["cursor"],
	"set the cursor bozo",
	"cursor <mode>",
	(msg, agent) => {
		if (agent.platform !== "mpp") return;
		if (!msg.argv[1]) return "Specify a mode.";

		const cursor = (agent as MPPAgent).cursor;
		cursor.props.currentAnimation = msg.argv[1];
	}
);
