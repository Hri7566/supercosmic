import { scopedEval } from "../..";
import { BaseCommandMessage } from "../../commands/CommandHandler";

export class MicroHandler {
	public static async handleMicroCommand(command: BaseCommandMessage) {
		let microcommand = command.argv[0].substring(1);

		switch (microcommand) {
			case "help":
			case "commands":
			case "cmds":
			default:
				return "Microcommands: /help | /js | /exit";
				break;
			case "js":
			case "eval":
				try {
					const out = scopedEval(command.argv.slice(1).join(" "));
					return `(${typeof out}) ${out}`;
				} catch (err) {
					return err;
				}
				break;
			case "exit":
			case "stop":
				process.exit();
				break;
		}
	}
}
