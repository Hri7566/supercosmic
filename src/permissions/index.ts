import { Role } from "@prisma/client";
import { loadConfig } from "../util/config";
import { Logger } from "../util/Logger";
import { defaultConfig } from "./default";

const logger = new Logger("Permission Handler");

/**
 * Check two permission strings to see if they match
 *
 * Usage:
 * ```ts
 * handlePermission("cosmic.command.help", "cosmic.command.*"); // true
 * ```
 * @param node1 Permission string
 * @param node2 Permission string
 */
export function handlePermission(node1: string, node2: string) {
	// Split strings into arrays of nodes
	// "thing.thing2" -> ["thing", "thing2"]
	const hierarchy1 = node1.split(".");
	const hierarchy2 = node2.split(".");

	// Check nodes in order
	for (let i = 0; i < hierarchy1.length; i++) {
		if (hierarchy1[i] == hierarchy2[i]) {
			// Last node?
			if (i == hierarchy1.length - 1 || i == hierarchy2.length - 1) {
				return true;
			} else {
				continue;
			}
		}

		// Wildcard?
		if (hierarchy1[i] == "*") return true;
		if (hierarchy2[i] == "*") return true;

		return false;
	}

	return false;
}

/**
 * Check if a group has a permission
 * @param role Prisma role
 * @param permission Permission to check
 */
export function hasPermission(role: Role, permission: string) {
	const roleVal = roles.get(role);
	if (!roleVal) return false;

	if (roleVal.inherits) {
		// logger.debug(
		// 	"Detected role inheritence from " + role + " to " + roleVal.inherits
		// );
		if (hasPermission(roleVal.inherits, permission)) return true;
	}

	for (const perm of roleVal.permissions) {
		// logger.debug("Checking " + permission + " and " + perm);
		if (handlePermission(permission, perm)) return true;
	}

	return false;
}

export const roles = new Map<Role, TRole>();

export type TRole = {
	displayName: string;
	inherits?: Role;
	permissions: string[];
};

let config: Record<Role, TRole>;

export function loadRoleConfig() {
	config = loadConfig("config/roles.yml", defaultConfig);

	roles.set("NONE", config.NONE);
	roles.set("MODERATOR", config.MODERATOR);
	roles.set("ADMINISTRATOR", config.ADMINISTRATOR);
	roles.set("OWNER", config.OWNER);
}

export function getRole(role: Role) {
	return roles.get(role);
}

export function fuzzyFindRoleByDisplayName(fuzzy: string) {
	for (const [key, val] of roles) {
		if (val.displayName.toLowerCase().includes(fuzzy.toLowerCase()))
			return val;
	}
}
