import type { MPPNetAgent } from "../../../services/mppnet";
import { Command } from "../../Command";

export const cursor = new Command(
	"cursor",
	["cursor"],
	"set the cursor bozo",
	"cursor <mode>",
	(msg, agent) => {
		if (agent.platform !== "mpp") return;
		if (!msg.argv[1]) return "Specify a mode.";

		const cursor = (agent as MPPNetAgent).cursor;
		cursor.props.currentAnimation = msg.argv[1];
	}
);
