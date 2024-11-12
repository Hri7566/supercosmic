import Client from "mpp-client-net";
import { ServiceAgent } from "../ServiceAgent";
import { CommandHandler } from "../../commands/CommandHandler";
import { Cursor } from "./Cursor";
import { ChatMessage } from "../console/MicroHandler";
import { help as helpCommand } from "../../commands/commands/general/help";

export class MPPNetAgent extends ServiceAgent<Client> {
	public cursor: Cursor;

	constructor(
		uri: string,
		public desiredChannel: string,
		public desiredUser: { name: string; color: string },
		token: string,
		public debug: boolean = false
	) {
		const cl = new Client(uri, token);
		super("mpp", cl);
		this.cursor = new Cursor(this);
		this.cursor.show();
	}

	public start() {
		this.client.start();
	}

	public stop() {
		this.client.stop();
	}

	protected bindEventListeners(): void {
		super.bindEventListeners();

		this.client.on("hi", msg => {
			this.client.setChannel(this.desiredChannel);
		});

		this.client.on("ch", msg => {
			this.fixUser();
		});

		this.client.on("t", msg => {
			// this.fixUser();
		});

		this.client.on("a", async msg => {
			// Construct database ID
			const _id = "MPP_" + this.client.uri + "_" + msg.p._id;

			// Emit chat event (used by microhandler)
			this.emit("chat", {
				m: "a",
				a: msg.a,
				p: {
					_id,
					name: msg.p.name,
					color: msg.p.color,
					platformId: msg.p._id
				},
				originalMessage: msg
			} as ChatMessage);

			// Construct command arguments
			let args = msg.a.split(" ");

			// Run command and get output
			const str = await globalThis.commandHandler.handleCommand(
				{
					m: "command",
					a: msg.a,
					argc: args.length,
					argv: args,
					p: {
						_id,
						name: msg.p.name,
						color: msg.p.color,
						platformId: msg.p._id
					},
					originalMessage: msg
				},
				this
			);

			// Send message in chat
			if (str) {
				if (typeof str === "string") {
					if (str.includes("\n")) {
						let sp = str.split("\n");

						for (const s of sp) {
							this.client.sendArray([
								{
									m: "a",
									message: `\u034f${s}`
								}
							]);
						}
					} else {
						this.emit("send chat", str);
					}
				} else {
					this.emit("send chat", str);
				}
			}
		});

		this.on("send chat", (text: string) => {
			// Send message in chat
			if (text.length > 512) {
				// Split every 512 chars
				for (let i = 0; i < text.length; i += 512) {
					let small = text.substring(i, i + 512);

					this.client.sendArray([
						{
							m: "a",
							message: `\u034f${small}`
						}
					]);
				}
			} else {
				this.client.sendArray([
					{
						m: "a",
						message: `\u034f${text}`
					}
				]);
			}
		});
	}

	public fixUser() {
		if (!this.client.user) return;

		let after = "";

		if (CommandHandler.prefixes[0])
			after = ` (${CommandHandler.prefixes[0].id}${
				CommandHandler.prefixes[0].spaced ? " " : ""
			}${helpCommand.aliases[0]})`;

		if (
			!this.client.user.name.startsWith(this.desiredUser.name + after) ||
			this.client.user.color !== this.desiredUser.color
		) {
			this.client.sendArray([
				{
					m: "userset",
					set: {
						name: this.desiredUser.name + after,
						color: this.desiredUser.color
					}
				}
			]);
		}
	}

	/**
	 * Get a participant object with part of their name or user ID
	 * @param fuzzy Part of username or user ID
	 * @returns Found participant or undefined
	 */
	public getParticipant(fuzzy: string) {
		for (const p of Object.values(this.client.ppl)) {
			if (!p._id.includes(fuzzy) && !p.name.includes(fuzzy)) return;
			return p as unknown as {
				name: string;
				_id: string;
				id: string;
				color: string;
				x: number;
				y: number;
			};
		}
	}
}
