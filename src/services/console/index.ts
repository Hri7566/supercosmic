import {
	BaseCommandMessage,
	CommandHandler
} from "../../commands/CommandHandler";
import { ServiceAgent } from "../ServiceAgent";
import readline from "readline";
import { MicroHandler } from "./MicroHandler";
import { Logger } from "../../util/Logger";

export class ConsoleAgent extends ServiceAgent<readline.ReadLine> {
	public desiredUser = {
		name: "🟇 𝙎𝙪𝙥𝙚𝙧 Cosmic",
		color: "#1d0054"
	};

	public logger = new Logger("Console");
	public viewAgent: ServiceAgent<unknown> | undefined;

	constructor() {
		const cl = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});

		super("console", cl);
	}

	public started = false;

	public start() {
		if (this.started) return;
		this.started = true;
		this.client.setPrompt("> ");
		this.client.prompt(true);
	}

	public stop() {
		if (!this.started) return;
		this.started = false;
		this.client.setPrompt("");
	}

	protected bindEventListeners(): void {
		super.bindEventListeners();

		this.client.on("line", async text => {
			const args = text.split(" ");

			const message: BaseCommandMessage = {
				m: "command",
				a: text,
				argc: args.length,
				argv: args,
				originalMessage: text,
				p: {
					platformId: "console",
					_id: "console",
					name: "Console",
					color: "#ffffff"
				}
			};

			let out;

			if (text.startsWith("/")) {
				out = await MicroHandler.handleMicroCommand(message, this);
			} else {
				out = await CommandHandler.handleCommand(message, this);
			}

			if (out) {
				this.logger.info(out);
			} else {
				this.emit("send chat", message.a);
			}

			this.client.prompt();
		});
	}
}
