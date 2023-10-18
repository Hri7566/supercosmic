import { ServiceAgent } from "../services/ServiceAgent";
import { Command } from "./Command";
import { CommandGroup } from "./CommandGroup";
import { Prefix } from "./Prefix";

export interface CommandMessage<T = unknown> {
	m: "command";
	a: string;
	argv: string[];
	argc: number;
	originalMessage: T;
}

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
		msg: CommandMessage,
		agent: ServiceAgent<unknown>
	) {
		let usedPrefix: Prefix | undefined;

		for (const prefix of this.prefixes) {
			if (msg.argv[0].startsWith(prefix.id)) {
				usedPrefix = prefix;

				if (prefix.spaced) {
					msg.argv.splice(0, 1);
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

		try {
			const out = usedCommand.callback(msg, agent);
			if (out) return out;
		} catch (err) {
			console.error(err);
			return "An error has occurred.";
		}
	}
}
