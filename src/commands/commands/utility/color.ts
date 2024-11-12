import { CosmicColor } from "../../../util/CosmicColor";
import { Command } from "../../Command";

export const color = new Command(
	"color",
	["color"],
	"colors, bozo",
	"color [<r> <g> <b> | <hex>]",
	msg => {
		if (msg.argv[3]) {
			// test for rgb
			try {
				let rstr = msg.argv[1];
				let gstr = msg.argv[2];
				let bstr = msg.argv[3];

				let r = parseInt(rstr);
				let g = parseInt(gstr);
				let b = parseInt(bstr);

				if (r > 255 || g > 255 || b > 255) throw "too large";
				if (r < 0 || g < 0 || b < 0) throw "too small";

				let c = new CosmicColor(r, g, b);
				let outc = `${c.getName().replace("A", "a")} [${c.toHexa()}]`;
				return `The RGB color ${r}, ${g}, ${b} is ${outc}`;
			} catch (e) {
				return `The color '${msg.argv[1]}, ${msg.argv[2]}, ${msg.argv[3]}' is not a valid RGB color. Reason: ${e}`;
			}
		} else if (msg.argv[1]) {
			if (msg.argv[1].match(/#[0-9a-f]{6}/gi) !== null) {
				// definitely a hex string
				let c = new CosmicColor(msg.argv[1]);
				let outc = `${c.getName().replace("A", "a")} [${c.toHexa()}]`;
				return `The hex color '${msg.argv[1]}' is ${outc}`;
			} else {
				return `I don't think '${msg.argv[1]}' is a hex color.`;
			}
		} else {
			if (msg.p.color) {
				let c = new CosmicColor(msg.p.color);
				let outc = `${c.getName().replace("A", "a")} [${c.toHexa()}]`;
				return `${msg.p.name}, your color is ${outc}`;
			} else {
				return `You... have no color property or something? I guess just look at the command usage and manually choose a color so this doesn't happen.`;
			}
		}
	},
	false
);
