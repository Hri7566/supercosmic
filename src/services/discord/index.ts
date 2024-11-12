import Discord from "discord.js";
import { ServiceAgent } from "../ServiceAgent";
import { ChatMessage } from "../console/MicroHandler";
import { CommandHandler } from "../../commands/CommandHandler";

export class DiscordAgent extends ServiceAgent<Discord.Client> {
	constructor(private token: string) {
		const cl = new Discord.Client({
			intents: ["Guilds", "GuildMessages", "MessageContent"]
		});

		super("discord", cl);
	}

	private wasDestroyed = false;

	public start(): void {
		this.wasDestroyed
			? (this.client = new Discord.Client({
					intents: ["Guilds", "GuildMessages", "MessageContent"]
			  }))
			: undefined;

		this.wasDestroyed = false;

		this.client.login(this.token);
	}

	public stop(): void {
		this.client.destroy();
		this.wasDestroyed = true;
	}

	private lastChannelId: string | undefined;

	public getLastChannelId() {
		return this.lastChannelId;
	}

	protected bindEventListeners(): void {
		this.client.on("ready", () => {});

		this.client.on("messageCreate", async msg => {
			const _id = "DISCORD_" + msg.author.id;

			this.emit("chat", {
				m: "a",
				a: msg.content,
				p: {
					_id,
					name: msg.author.username,
					color: msg.author.hexAccentColor || "#000000",
					platformId: msg.author.id
				}
			} as ChatMessage);

			let args = msg.content.split(" ");

			const str = await globalThis.commandHandler.handleCommand(
				{
					m: "command",
					a: msg.content,
					argc: args.length,
					argv: args,
					p: {
						_id,
						name: msg.author.username,
						color: msg.author.hexAccentColor || "#000000",
						platformId: msg.author.id
					},
					originalMessage: msg
				},
				this
			);

			if (str) {
				if (typeof str === "string") {
					const channel = await this.client.channels.fetch(
						msg.channelId
					);

					if (!channel) return;
					if (!channel.isTextBased()) return;
					channel.send(`\u034f${str}`);
				}
			}
		});

		this.on("send chat", async text => {
			if (!this.lastChannelId) return;

			const channel = await this.client.channels.fetch(
				this.lastChannelId
			);

			if (!channel) return;
			if (!channel.isTextBased()) return;

			channel.send(`\u034f${text}`);
		});
	}
}
