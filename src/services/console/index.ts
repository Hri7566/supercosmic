import { CommandHandler, CommandMessage } from "../../commands/CommandHandler";
import { loadConfig } from "../../util/config";
import { ServiceAgent } from "../ServiceAgent";
import readline from "readline";

const config = loadConfig("config/switchchat.yml", {
	ownerOnly: false
});

export class SwitchChatAgent extends ServiceAgent<readline.ReadLine> {
	public desiredUser = {
		name: "🟇 𝙎𝙪𝙥𝙚𝙧 Cosmic",
		color: "#1d0054"
	};

	constructor(token: string) {
		const cl = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});

		super(cl);
	}

	public started = false;

	public start() {
		if (this.started) return;
		this.started = true;
		this.client.setPrompt(">");
		this.client.prompt(true);
	}

	public stop() {
		if (!this.started) return;
		this.started = false;
		this.client.setPrompt("");
	}

	protected bindEventListeners(): void {
		super.bindEventListeners();

		this.client.on("command", async cmd => {
			if (config.ownerOnly && !cmd.ownerOnly) return;

			console.log(
				`${cmd.user.displayName}: ${cmd.ownerOnly ? "^" : "\\"}${
					cmd.command
				} ${cmd.args.join(" ")}`
			);

			const message: CommandMessage = {
				m: "command",
				a: `${cmd.command} ${cmd.args.join(" ")}`,
				argc: cmd.args.length + 1,
				argv: [cmd.command, ...cmd.args],
				originalMessage: cmd
			};

			const out = await CommandHandler.handleCommand(message, this);
			console.log(out);
			if (out) this.client.tell(cmd.user.name, out);
		});
	}
}
