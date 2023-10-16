import EventEmitter from "events";
import { MPPAgent } from "./mpp";
import env from "../util/env";
import { ServiceAgent } from "./ServiceAgent";

export class ServiceLoader {
	public static agents = new Array<ServiceAgent<unknown>>();

	public static loadServices() {
		const testAgent = new MPPAgent("wss://mppclone.com", env.MPPNET_TOKEN);
		testAgent.start();
	}
}
