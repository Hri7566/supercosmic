import { Command } from "./Command";

export class CommandGroup {
	public commands = new Array<Command>();

	constructor(public id: string, public displayName: string) {}

	public addCommand(command: Command) {
		this.commands.push(command);
	}

	public addCommands(commands: Command[]) {
		for (const command of commands) {
			this.addCommand(command);
		}
	}
}
