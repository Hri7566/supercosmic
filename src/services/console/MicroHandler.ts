import { ServiceLoader } from "..";
import { scopedEval } from "../..";
import { BaseCommandMessage } from "../../commands/CommandHandler";
import { ServiceAgent } from "../ServiceAgent";
import { MPPAgent } from "../mpp";

export class MicroHandler {
	public static async handleMicroCommand(
		command: BaseCommandMessage,
		agent: ServiceAgent<unknown>
	) {
		let microcommand = command.argv[0].substring(1);

		switch (microcommand) {
			case "help":
			case "commands":
			case "cmds":
			default:
				return "Microcommands: /help | /js | /exit | /list | /view";
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
			case "list":
				if (agent.platform !== "console")
					return "This command is only for console agents.";

				for (let i in ServiceLoader.agents) {
					const agent2 = ServiceLoader.agents[i];
					if (agent2.platform == "mpp") {
						agent.emit(
							"log",
							`${i} - ${agent2.platform} - ${
								(agent2 as MPPAgent).desiredChannel
							}`
						);
					} else {
						agent.emit("log", `${i} - ${agent2.platform}`);
					}
				}
				break;
			case "view":
			case "connect":
				if (agent.platform !== "console")
					return "This command is only for console agents.";

				return "WIP";
				break;
		}
	}
}
