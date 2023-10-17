import Client from "mpp-client-net";
import { ServiceAgent } from "../ServiceAgent";
import { ptr } from "bun:ffi";

let p;

export class MPPAgent extends ServiceAgent<Client> {
	public desiredUser = {
		name: "🟇 𝙎𝙪𝙥𝙚𝙧 Cosmic (no commands yet)",
		color: "#1d0054"
	};

	public desiredChannel = "nothing";

	constructor(uri: string, token: string) {
		const cl = new Client(uri, token);
		super(cl);
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
			this.emit("log", msg.u);
			this.client.setChannel(this.desiredChannel);

			console.log(
				msg.u.name !== this.desiredUser.name ||
					msg.u.color !== this.desiredUser.color
			);

			if (
				msg.u.name !== this.desiredUser.name ||
				msg.u.color !== this.desiredUser.color
			) {
				// setTimeout(() => {
				this.client.sendArray([
					{
						m: "userset",
						set: this.desiredUser
					}
				]);
				// }, 1000);
			}
		});

		this.client.on("a", msg => {
			p = ptr(new TextEncoder().encode(msg.a).buffer);
			// handleCommand(p);
			console.log(`${msg.p.name}: ${msg.a}`);
		});
	}
}
