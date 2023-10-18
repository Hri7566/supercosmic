import { Command } from "../../Command";

import { evaluate } from "mathjs";

export const math = new Command(
	"math",
	["math"],
	"math bozo",
	"{prefix}math",
	(msg, agent) => {
		try {
			const argcat = msg.argv.slice(1, msg.argv.length).join(" ");
			console.log(argcat);
			const answer = evaluate(argcat);
			return `Answer: ${answer}`;
		} catch (err) {
			console.error(err);
			return `Invalid expression: ${err}`;
		}
	}
);
