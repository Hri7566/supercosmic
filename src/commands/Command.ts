import { ServiceAgent } from "../services/ServiceAgent";
import { CommandMessage } from "./CommandHandler";

export class Command {
	public static getUsage(usage: string, prefix: string) {
		return usage.split("{prefix}").join(prefix);
	}

	constructor(
		public id: string,
		public aliases: string[],
		public description: string,
		public usage: string,
		public callback: (
			msg: CommandMessage,
			agent: ServiceAgent<unknown>
		) => Promise<string | void> | string | void,
		public visible: boolean = true
	) {}
}
