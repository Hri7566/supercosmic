import { readItems, subtractItem } from "../../../data/inventory";
import { FoodItem } from "../../../economy/Item";
import { TEatBhv, eatBhv } from "../../../economy/eatBhv";
import { Logger } from "../../../util/Logger";
import { Command } from "../../Command";

const logger = new Logger("eat");

export const eat = new Command(
	"eat",
	["eat"],
	"bozo hungy",
	"eat",
	async (msg, agent) => {
		if (!msg.argv[1]) return "What do you want to eat?";
		const itemFuzzy = msg.argv[1].toLowerCase();
		const items = await readItems(msg.user.id);
		if (!items) return "You have nothing to eat.";

		let what = items.find(item => {
			if (item.name.toLowerCase().includes(itemFuzzy)) return true;
		}) as FoodItem | undefined;

		if (!what) return `You don't have any "${itemFuzzy}" to eat.`;
		if (!what.consumable) return `You can't eat the ${what.name}.`;
		if (!what.edible) return `The ${what.name} is not edible.`;

		// TODO cause eat behavior
		let bhv: TEatBhv | undefined;

		if (what.id.includes("cake")) {
			// Find regular cake behavior
			bhv = eatBhv.get("cake");
		} else {
			// Find eat bhv for item ID
			bhv = eatBhv.get(what.id);
		}

		if (!bhv) return `You don't know how to eat ${what.name}.`;
		const reply = await bhv(msg, agent, what);

		if (reply.consumed) {
			const worked = await subtractItem(msg.user.id, what);
			if (!worked) logger.warn(`Failed to subtract item ${what.name} from user ${msg.user.id}`);
		}

		return reply.output;
		//return `You ate the ${what.name}. (not really)`;
	}
);
