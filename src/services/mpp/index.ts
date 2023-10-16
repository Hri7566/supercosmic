import Client from "mpp-client-net";
import { ServiceAgent } from "../ServiceAgent";

export class MPPAgent extends ServiceAgent<Client> {
	constructor(uri: string, token: string) {
		const cl = new Client(uri, token);
		super(cl);
	}

	public start() {
		this.client.start();
		// TODO get rid of this gay shit
		this.client.setChannel("Simon Says");
	}

	public stop() {
		this.client.stop();
	}
}
