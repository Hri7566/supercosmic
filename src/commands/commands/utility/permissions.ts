import {
	TRole,
	fuzzyFindRoleByDisplayName,
	getRole
} from "../../../permissions";
import { Command } from "../../Command";

export const permissions = new Command(
	"permissions",
	["permissions", "perms", "perm"],
	"list permissions of a role bozo",
	"permissions [role]",
	(msg, agent) => {
		const userRole = getRole(msg.user.role);
		let role: TRole | undefined;

		if (userRole) role = userRole;
		if (msg.argv[1]) role = fuzzyFindRoleByDisplayName(msg.argv[1]);

		if (role) {
			return `Permissions for role "${
				role.displayName
			}": ${role.permissions.join(" | ")}`;
		} else {
			return `No role found.`;
		}
	}
);
