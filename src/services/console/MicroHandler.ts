import { Role } from "@prisma/client";
import { ConsoleAgent } from ".";
import { ServiceLoader } from "..";
import { scopedEval } from "../..";
import { BaseCommandMessage } from "../../commands/CommandHandler";
import { readUser, updateUser } from "../../data/user";
import { CosmicColor } from "../../util/CosmicColor";
import { ServiceAgent } from "../ServiceAgent";
import { MPPNetAgent } from "../mppnet";
import { readFileSync } from "fs";

export interface ChatMessage<T = unknown> {
	m: "a";
	a: string;
	p: {
		_id: string;
		platformId: string;
		name: string;
		color: string;
	};
	originalMessage: T;
}

function onChildMessage(msg: ChatMessage) {
	const consoleAgent = ServiceLoader.agents.find(
		ag => ag.platform === "console"
	) as ConsoleAgent | undefined;

	if (!consoleAgent) return;

	consoleAgent.logger.info(
		`[${msg.p.platformId.substring(0, 6)}] ${msg.p.name}: ${msg.a}`
	);
}

function onConsoleMessage(text: string) {
	const consoleAgent = ServiceLoader.agents.find(
		ag => ag.platform === "console"
	) as ConsoleAgent | undefined;

	if (!consoleAgent) return;
	if (!consoleAgent.viewAgent) return;

	consoleAgent.viewAgent.emit("send chat", `[Console] ${text}`);
}

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
				return "Microcommands: /help | /js <expr> | /exit | /list | /view <index> | /unview | /admin+ <id> | /admin- <id> | /owner+ <id> | /owner- <id>";
				break;
			case "js":
			case "eval":
				if (!command.argv[1]) return "Error: No arguments provided";
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
					if (agent2.platform === "mpp") {
						agent.emit(
							"log",
							`${i} - ${agent2.platform} - ${(agent2 as MPPNetAgent).desiredChannel
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

				try {
					let index = parseInt(command.argv[1]);
					if (typeof index !== "number")
						return "Please provide an index. (check /list)";
					let walkie = agent as ConsoleAgent;
					let talky = ServiceLoader.agents[index];

					if (index === ServiceLoader.agents.indexOf(walkie))
						return "Why would you want to chat with yourself?";

					// Remove old listeners
					if (walkie.viewAgent) {
						walkie.viewAgent.off("chat", onChildMessage);
						walkie.off("send chat", onConsoleMessage);
					}

					// Add new listeners
					walkie.viewAgent = talky;
					walkie.viewAgent.on("chat", onChildMessage);
					walkie.on("send chat", onConsoleMessage);
					return `Now veiwing agent ${index}`;
				} catch (err) {
					agent.logger.error(err);
				}

				break;
			case "unview":
			case "stopview":
			case "stopviewing":
				if (agent.platform !== "console")
					return "This command is only for console agents.";

				try {
					let walkie = agent as ConsoleAgent;

					// Remove old listeners
					if (walkie.viewAgent) {
						walkie.viewAgent.off("chat", onChildMessage);
						walkie.off("send chat", onConsoleMessage);
					}

					delete walkie.viewAgent;
				} catch (err) {
					agent.logger.error(err);
				}

				break;
			case "ppl":
				if (agent.platform !== "console")
					return "This command is only for console agents.";

				let conAg = agent as ConsoleAgent;
				if (!conAg.viewAgent) return "There is no agent being viewed.";
				if (conAg.viewAgent.platform !== "mpp")
					return "The view agent is not on MPP.";

				const ppl = (conAg.viewAgent as MPPNetAgent).client.ppl;
				return `MPP Users: ${Object.values(ppl).map(
					p =>
						`\n - ${p._id} (user) / ${p.id} (part): ${p.name} (${p.color
						}, ${new CosmicColor(p.color).getName()})`
				)}`;
				break;
			case "admin+":
				const userId = command.argv
					.slice(1, command.argv.length)
					.join(" ");

				let user = await readUser(userId);
				if (!user) return "No such user.";

				user.role = Role.ADMINISTRATOR;
				await updateUser(user);

				return `Made user "${user.name}" [${user.platformId.substring(
					0,
					6
				)}...] an administrator`;
				break;
			case "admin-":
				const userId2 = command.argv
					.slice(1, command.argv.length)
					.join(" ");

				let user2 = await readUser(userId2);
				if (!user2) return "No such user.";

				user2.role = Role.NONE;
				await updateUser(user2);

				return `Made user "${user2.name}" [${user2.platformId.substring(
					0,
					6
				)}...] a normal user.`;
				break;
			case "owner+":
				const userId3 = command.argv
					.slice(1, command.argv.length)
					.join(" ");

				let user3 = await readUser(userId3);
				if (!user3) return "No such user.";

				user3.role = Role.OWNER;
				await updateUser(user3);

				return `Made user "${user3.name}" [${user3.platformId.substring(
					0,
					6
				)}...] an owner`;
				break;
			case "owner-":
				const userId4 = command.argv
					.slice(1, command.argv.length)
					.join(" ");

				let user4 = await readUser(userId4);
				if (!user4) return "No such user.";

				user4.role = Role.NONE;
				await updateUser(user4);

				return `Made user "${user4.name}" [${user4.platformId.substring(
					0,
					6
				)}] a normal user.`;
				break;
		}
	}
}
