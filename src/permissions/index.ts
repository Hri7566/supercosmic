import { Role } from "@prisma/client";
import { loadConfig } from "../util/config";

/**
 * Check two permission strings to see if they match
 * @param node1 Permission string
 * @param node2 Permission string
 */
export function handlePermission(node1: string, node2: string) {
	const hierarchy1 = node1.split(".");
	const hierarchy2 = node2.split(".");

	for (let i = 0; i < hierarchy1.length; i++) {
		if (i == hierarchy1.length - 1 || i == hierarchy2.length) {
			if (hierarchy1[i] == hierarchy2[i]) return true;
			if (hierarchy1[i] == "*") return true;
			if (hierarchy2[i] == "*") return true;
		} else {
			if (hierarchy1[i] == hierarchy2[i]) continue;
			if (hierarchy1[i] == "*") return true;
			if (hierarchy2[i] == "*") return true;
		}

		return false;
	}

	return false;
}

console.log(handlePermission("*", "*"));

/**
 * Check if a group has a permission
 * @param role Prisma role
 * @param permission Permission to check
 */
export function hasPermission(role: Role, permission: string) {
	// TODO hasPermission
	return;
}

export const roles = new Map<Role, TRole>();

export type TRole = {
	displayName: string;
	permissions: string[];
} & (
	| {
			permissions: string[];
	  }
	| {
			inherits: Role;
			permissions?: string[];
	  }
);

let defaultConfig = {
	NONE: {
		displayName: "None",
		permissions: [
			"cosmic.commandGroup.general",

			"cosmic.command.inventory",

			"cosmic.command.magic8ball",

			"cosmic.command.color",
			"cosmic.command.id",
			"cosmic.command.math",
			"cosmic.command.memory"
		]
	},
	MODERATOR: {
		displayName: "Moderator",
		inherits: "NONE",
		permissions: [
			"cosmic.commandGroup.economy",
			"cosmic.command.msg",
			"cosmic.command.memory"
		]
	},
	ADMINISTRATOR: {
		displayName: "Administrator",
		inherits: "MODERATOR",
		permissions: ["cosmic.commandGroup."]
	},
	OWNER: {
		displayName: "Owner",
		permissions: ["*"]
	}
} as Record<Role, TRole>;

let config: Record<Role, TRole>;

export function loadRoleConfig() {
	config = loadConfig("config/roles.yml", defaultConfig);
	console.log(config);
}
