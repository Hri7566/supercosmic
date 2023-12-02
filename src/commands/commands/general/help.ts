import { hasPermission } from "../../../permissions";
import { Command } from "../../Command";
import { CommandHandler } from "../../CommandHandler";

export const help = new Command(
	"help",
	["help", "h", "commands", "cmds"],
	"get help bozo",
	"help [command]",
	(msg, agent) => {
		if (msg.argv[1]) {
			// Get command usage
			let command: Command | undefined;

			commandGroupLoop: for (const commandGroup of CommandHandler.commandGroups) {
				commandLoop: for (const cmd of commandGroup.commands) {
					if (cmd.aliases.includes(msg.argv[1])) {
						command = cmd;
						break commandGroupLoop;
					}
				}
			}
			if (!command) return `Command "${msg.argv[1]}" not found.`;

			return `🌟 Description: ${command.description} | 🛠 Usage: ${command.usage}`;
		} else {
			// Just list commands
			const list = CommandHandler.commandGroups.map(commandGroup => {
				return (
					commandGroup.displayName +
					": " +
					commandGroup.commands
						.map(command => {
							if (!command.visible) return;
							if (
								!hasPermission(
									msg.user.role,
									`cosmic.command.${command.id}`
								)
							)
								return;
							return command.aliases[0];
						})
						.filter(val => {
							return typeof val !== "undefined";
						})
						.join(" | ")
				);
			});

			return list.join("\n");
		}
	}
);
