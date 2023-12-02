import { Command } from "../../Command";
import { evaluate } from "mathjs";

export const math = new Command(
	"math",
	["math"],
	"math bozo",
	"math <expression>",
	msg => {
		try {
			const argcat = msg.argv.slice(1, msg.argv.length).join(" ");
			const answer = evaluate(argcat);
			return `Answer: ${answer}`;
		} catch (err) {
			return `Invalid expression: ${err}`;
		}
	}
);
