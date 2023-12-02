import { MicroHandler } from "../../../services/console/MicroHandler";
import { Command } from "../../Command";

export const ic = new Command(
	"ic",
	["ic"],
	"use an internal command bozo",
	"ic <command>",
	async (msg, agent) => {
		let argcat = msg.argv.slice(1, msg.argv.length).join(" ");
		let args = argcat.split(" ");
		return (await MicroHandler.handleMicroCommand(
			{
				m: "command",
				a: argcat,
				argc: args.length,
				argv: args,
				originalMessage: msg,
				p: msg.p
			},
			agent
		)) as string;
	}
);
