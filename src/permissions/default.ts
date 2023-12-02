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
			"cosmic.command.memory",
			"cosmic.command.role"
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
		permissions: ["cosmic.commandGroup.*"]
	},
	OWNER: {
		displayName: "Owner",
		permissions: ["*"]
	}
} as Record<Role, TRole>;
