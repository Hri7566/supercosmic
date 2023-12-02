import { Inventory, Role, User } from "@prisma/client";
import { createUser, readUser } from "../data/user";
import { ServiceAgent } from "../services/ServiceAgent";
import { Command } from "./Command";
import { CommandGroup } from "./CommandGroup";
import { Prefix } from "./Prefix";
import { createInventory, readInventory } from "../data/inventory";

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
	public static prefixes = new Array<Prefix>(
		{
			id: "cosmic",
			spaced: true
		},
		{
			id: "*",
			spaced: false
		}
	);

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

			if (agent.platform == "console" && msg.p._id == "console") {
				await createUser({
					id: msg.p._id,
					platform: agent.platform,
					platformId: msg.p.platformId,
					name: msg.p.name,
					role: Role.NONE
				});
			}

			user = await readUser(msg.p._id);
			if (!user)
				return "Somehow, something has gone terribly wrong and I can't create user data for you. I can't run your command now.";
		}

		// Get inventory data
		let inventory = await readInventory(msg.p._id);

		if (!inventory) {
			await createInventory({
				userId: msg.p._id,
				items: []
			});

			inventory = await readInventory(msg.p._id);
			if (!inventory)
				return "You have no inventory and I have been told I can't give you one. Sorry, your command won't work without it.";
		}

		let usedPrefix: Prefix | undefined;

		for (const prefix of this.prefixes) {
			if (msg.argv[0].startsWith(prefix.id)) {
				usedPrefix = prefix;

				if (prefix.spaced) {
					msg.argv.splice(0, 1);
					msg.argc--;
				}

				break;
			}
		}

		if (!usedPrefix) return;

		let usedAlias = msg.argv[0];
		if (!usedPrefix.spaced)
			usedAlias = msg.argv[0].substring(usedPrefix.id.length);

		if (!usedAlias) return;

		let usedCommand: Command | undefined;

		for (const group of this.commandGroups) {
			for (const command of group.commands) {
				if (command.aliases.includes(usedAlias)) {
					usedCommand = command;
					break;
				}
			}
		}

		if (!usedCommand) return;

		(msg as CommandMessage).user = user;
		(msg as CommandMessage).inventory = inventory;

		try {
			const out = usedCommand.callback(msg as CommandMessage, agent);
			if (out) return out;
		} catch (err) {
			console.error(err);
			return "An error has occurred.";
		}
	}
}
