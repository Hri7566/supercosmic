import { Role } from "@prisma/client";
import { TRole } from ".";

export const defaultConfig = {
	NONE: {
		displayName: "None",
		permissions: [
			"cosmic.commandGroup.general",

			"cosmic.command.inventory",

			"cosmic.command.magic8ball",

			"cosmic.command.color",
			"cosmic.command.id",
			"cosmic.command.math",
			"cosmic.command.role"
		]
	},
	MODERATOR: {
		displayName: "Moderator",
		inherits: "NONE",
		permissions: [
			"cosmic.commandGroup.economy",
			"cosmic.command.msg",
			"cosmic.command.memory",
			"cosmic.command.uptime"
		]
	},
	ADMINISTRATOR: {
		displayName: "Administrator",
		inherits: "MODERATOR",
		permissions: ["cosmic.commandGroup.*", "cosmic.command.ic"]
	},
	OWNER: {
		displayName: "Owner",
		permissions: ["*"]
	}
} as Record<Role, TRole>;
