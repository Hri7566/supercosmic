import EventEmitter from "events";
import { MPPAgent } from "./mpp";
import env from "../util/env";
import { ServiceAgent } from "./ServiceAgent";

export class ServiceLoader {
	public static agents = new Array<ServiceAgent<unknown>>();

	public static loadServices() {
		const testAgent = new MPPAgent(
			"wss://smnmpp.hri7566.info:8448",
			env.MPPNET_TOKEN
		);

		testAgent.start();
	}
}
