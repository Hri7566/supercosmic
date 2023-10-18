import EventEmitter from "events";
import { MPPAgent } from "./mpp";
import env from "../util/env";
import { ServiceAgent } from "./ServiceAgent";
import { loadConfig } from "../util/config";
import { z } from "zod";
import { SwitchChatAgent } from "./switchchat";

/**
 * Services are anything (any platforms or environments) that the bot will directly communicate to users with
 */

const config = loadConfig("config/services.yml", {
	enableConsole: true,
	enableMPP: false,
	enableDiscord: false,
	enableSwitchChat: false
});

export class ServiceLoader {
	public static agents = new Array<ServiceAgent<unknown>>();

	public static addAgent(agent: ServiceAgent<unknown>) {
		this.agents.push(agent);
	}

	public static loadServices() {
		if (config.enableMPP) {
			// TODO Implement URI and channel configuration
			const testAgent = new MPPAgent(
				"wss://mppclone.com:8443",
				env.MPPNET_TOKEN
			);

			testAgent.start();
			this.addAgent(testAgent);
		}

		if (config.enableSwitchChat) {
			const switchChatAgent = new SwitchChatAgent(
				env.CHATBOX_LICENSE_KEY
			);

			switchChatAgent.start();
			this.addAgent(switchChatAgent);
		}
	}
}
