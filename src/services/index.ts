import { MPPAgent } from "./mpp";
import env from "../util/env";
import { ServiceAgent } from "./ServiceAgent";
import { loadConfig } from "../util/config";
import { SwitchChatAgent } from "./switchchat";
import { ConsoleAgent } from "./console";
import { DiscordAgent } from "./discord";

/**
 * Services are anything (any platforms or environments) that the bot will directly communicate to users with
 */

const config = loadConfig("config/services.yml", {
	debug: false,
	enableConsole: true,
	enableMPP: false,
	enableDiscord: false,
	enableSwitchChat: false
});

interface MPPNetConfig {
	desiredUser: {
		name: string;
		color: string;
	};
	agents: Record<
		string,
		{ id: string; overrideToken?: string; overrideName?: string }[]
	>;
}

const mppConfig = loadConfig<MPPNetConfig>("config/mpp_net_channels.yml", {
	desiredUser: {
		name: "🟇 𝙎𝙪𝙥𝙚𝙧 Cosmic",
		color: "#1d0054"
	},
	agents: {
		"wss://mppclone.com": [
			{
				id: "✧𝓓𝓔𝓥 𝓡𝓸𝓸𝓶✧"
			}
		]
	}
});

export class ServiceLoader {
	public static agents = new Array<ServiceAgent<unknown>>();

	public static addAgent(agent: ServiceAgent<unknown>) {
		this.agents.push(agent);
	}

	public static loadServices() {
		if (config.enableMPP) {
			for (const uri of Object.keys(mppConfig.agents)) {
				for (const channel of mppConfig.agents[uri]) {
					const mppAgent = new MPPAgent(
						uri,
						channel.id,
						channel.overrideName
							? {
									name: channel.overrideName,
									color: mppConfig.desiredUser.color
							  }
							: mppConfig.desiredUser,
						env.MPPNET_TOKEN,
						config.debug
					);

					mppAgent.start();
					this.addAgent(mppAgent);
				}
			}
		}

		if (config.enableSwitchChat) {
			const switchChatAgent = new SwitchChatAgent(
				env.CHATBOX_LICENSE_KEY
			);

			switchChatAgent.start();
			this.addAgent(switchChatAgent);
		}

		if (config.enableDiscord) {
			const discordAgent = new DiscordAgent(env.DISCORD_TOKEN);

			discordAgent.start();
			this.addAgent(discordAgent);
		}

		if (config.enableConsole) {
			const consoleAgent = new ConsoleAgent();

			consoleAgent.start();
			this.addAgent(consoleAgent);
		}
	}
}
