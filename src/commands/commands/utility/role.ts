import { getRole } from "../../../permissions";
import { Command } from "../../Command";

export const role = new Command(
	"role",
	["role"],
	"get your role bozo",
	"role",
	(msg, agent) => {
		const role = getRole(msg.user.role);
		if (!role) return `Your role: ${msg.user.role} (this role is broken)`;
		return `Your role: ${role.displayName} [${msg.user.role}]`;
	}
);
