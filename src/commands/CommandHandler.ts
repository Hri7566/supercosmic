import { Inventory, Role, User } from "@prisma/client";
import { createUser, readUser, updateUser } from "../data/user";
import { ServiceAgent } from "../services/ServiceAgent";
import { Command } from "./Command";
import { CommandGroup } from "./CommandGroup";
import { Prefix } from "./Prefix";
import { createInventory, readInventory } from "../data/inventory";
import { hasPermission } from "../permissions";
import { Logger } from "../util/Logger";
import { balanceConfig } from "../economy/Balance";
import { loadConfig } from "../util/config";

const prefixConfig = loadConfig("config/prefixes.yml", {
	prefixes: [
		{
			id: "*",
			spaced: false
		},
		{
			id: "cosmic",
			spaced: true
		}
	]
});

export interface CommandMessage<T = unknown> {
	m: "command";
	a: string;
	argv: string[];
	argc: number;
	p: {
		_id: string;
		platformId: string;
		name: string;
		color: string;
	};
	originalMessage: T;
	user: NonNullable<User>;
	inventory: NonNullable<Inventory>;
}

export type BaseCommandMessage<T = unknown> = Omit<
	CommandMessage<T>,
	"user" | "inventory"
>;

export class CommandHandler {
	public static commandGroups = new Array<CommandGroup>();
	public static prefixes = new Set<Prefix>();

	public static logger = new Logger("Command Handler");

	public static addCommandGroup(group: CommandGroup) {
		this.commandGroups.push(group);
	}

	public static async handleCommand(
		msg: Omit<CommandMessage, "user" | "inventory">,
		agent: ServiceAgent<unknown>
	) {
		// Get user data
		let user = await readUser(msg.p._id);

		if (!user) {
			let role = Role.NONE;

			await createUser({
				id: msg.p._id,
				platform: agent.platform,
				platformId: msg.p.platformId,
				name: msg.p.name,
				role: role
			});

			user = await readUser(msg.p._id);
			if (!user)
				return "Somehow, something has gone terribly wrong and I can't create user data for you. I can't run your command now.";
		}

		if (user.name !== msg.p.name) {
			user.name = msg.p.name;
			await updateUser(user);
		}

		// Get inventory data
		let inventory = await readInventory(msg.p._id);

		if (!inventory) {
			await createInventory({
				userId: msg.p._id,
				items: [],
				balance: balanceConfig.defaultBalance || 0
			});

			inventory = await readInventory(msg.p._id);
			if (!inventory)
				return "You have no inventory and I have been told I can't give you one. Sorry, your command won't work without it.";
		}

		let usedPrefix: Prefix | undefined;
		let isSpacedAndNonMatching = false;

		for (const prefix of this.prefixes) {
			if (msg.argv[0].startsWith(prefix.id)) {
				usedPrefix = prefix;

				if (prefix.spaced) {
					if (prefix.id !== msg.argv[0])
						isSpacedAndNonMatching = true;
					msg.argv.splice(0, 1);
					msg.argc--;
				}

				break;
			}
		}

		if (!usedPrefix) return;
		if (isSpacedAndNonMatching) return;

		let usedAlias = msg.argv[0];
		if (!usedPrefix.spaced)
			usedAlias = msg.argv[0].substring(usedPrefix.id.length);

		if (!usedAlias) return;

		let usedCommand: Command | undefined;
		let usedCommandGroup: CommandGroup | undefined;

		for (const group of this.commandGroups) {
			for (const command of group.commands) {
				if (command.aliases.includes(usedAlias)) {
					usedCommand = command;
					usedCommandGroup = group;
					break;
				}
			}
		}

		if (!usedCommand) return;

		let permissionNode = `cosmic.command.${usedCommand.id}`;
		// this.logger.debug("Role:", user.role);
		// this.logger.debug("Node:", permissionNode);
		let groupNode;

		if (usedCommandGroup)
			groupNode = `cosmic.commandGroup.${usedCommandGroup.id}`;

		if (groupNode) {
			if (!hasPermission(user.role, groupNode)) {
				if (!hasPermission(user.role, permissionNode))
					return "No permission";
			}
		} else {
			if (!hasPermission(user.role, permissionNode))
				return "No permission";
		}

		(msg as CommandMessage).user = user;
		(msg as CommandMessage).inventory = inventory;

		try {
			const out = usedCommand.callback(msg as CommandMessage, agent);
			if (out) return out;
		} catch (err) {
			this.logger.error(err);
			return "An error has occurred.";
		}
	}
}

// Add prefixes
for (const prefix of prefixConfig.prefixes) {
	CommandHandler.prefixes.add(prefix);
}
