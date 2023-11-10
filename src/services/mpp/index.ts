import Client from "mpp-client-net";
import { ServiceAgent } from "../ServiceAgent";
import { CommandHandler } from "../../commands/CommandHandler";
import { Cursor } from "./Cursor";
import { ChatMessage } from "../console/MicroHandler";

export class MPPAgent extends ServiceAgent<Client> {
	public cursor: Cursor;

	constructor(
		uri: string,
		public desiredChannel: string,
		public desiredUser: { name: string; color: string },
		token: string
	) {
		const cl = new Client(uri, token);
		super("mpp", cl);
		this.cursor = new Cursor(this);
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
			this.fixUser();
		});

		this.client.on("t", msg => {
			this.fixUser();
		});

		this.client.on("a", async msg => {
			const _id = "MPP_" + this.client.uri + "_" + msg.p._id;

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

			let args = msg.a.split(" ");

			const str = await CommandHandler.handleCommand(
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

			if (str) {
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
			}
		});

		this.on("send chat", text => {
			this.client.sendArray([
				{
					m: "a",
					message: `\u034f${text}`
				}
			]);
		});
	}

	public fixUser() {
		if (!this.client.user) return;

		if (
			this.client.user.name !== this.desiredUser.name ||
			this.client.user.color !== this.desiredUser.color
		) {
			this.client.sendArray([
				{
					m: "userset",
					set: this.desiredUser
				}
			]);
		}
	}

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
