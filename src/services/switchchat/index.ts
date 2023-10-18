import { CommandHandler, CommandMessage } from "../../commands/CommandHandler";
import { loadConfig } from "../../util/config";
import { ServiceAgent } from "../ServiceAgent";
import { Client } from "switchchat";

const config = loadConfig("config/switchchat.yml", {
	ownerOnly: false
});

export class SwitchChatAgent extends ServiceAgent<Client> {
	public desiredUser = {
		name: "🟇 𝙎𝙪𝙥𝙚𝙧 Cosmic",
		color: "#1d0054"
	};

	constructor(token: string) {
		const cl = new Client(token);
		super(cl);

		this.client.defaultName = this.desiredUser.name;
		this.client.defaultFormattingMode = "markdown";
	}

	public start() {
		this.client.connect();
	}

	public stop() {
		this.client.close();
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
			if (out) await this.client.tell(cmd.user.name, out);
		});

		this.client.on("rawraw", data => {
			console.log(data);
		});
	}
}