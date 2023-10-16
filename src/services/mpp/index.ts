import Client from "mpp-client-net";
import { ServiceAgent } from "../ServiceAgent";

export class MPPAgent extends ServiceAgent<Client> {
	public desiredUser = {
		name: "🟇 𝙎𝙪𝙥𝙚𝙧 Cosmic (*help)",
		color: "#1d0054"
	};

	constructor(uri: string, token: string) {
		const cl = new Client(uri, token);
		super(cl);
	}

	public start() {
		this.client.start();
		// TODO get rid of this gay shit
		this.client.setChannel("blackmidi (huge lag)");
	}

	public stop() {
		this.client.stop();
	}

	protected bindEventListeners(): void {
		super.bindEventListeners();

		this.client.on("hi", msg => {
			this.emit("log", msg.u);

			if (
				msg.u.name !== this.desiredUser.name ||
				msg.u.color !== this.desiredUser.color
			) {
				this.client.sendArray([
					{
						m: "userset",
						set: this.desiredUser
					}
				]);
			}
		});

		this.client.on("a", msg => {
			const argv = msg.a.split(" ");
			const argc = argv.length;
		});
	}
}
