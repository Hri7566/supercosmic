import { JsonArray, JsonValue } from "@prisma/client/runtime/library";
import { KekklefruitTree } from "../../../economy/kekkle";
import { Command } from "../../Command";
import { addItem, updateInventory } from "../../../data/inventory";

export const pick = new Command(
	"pick",
	["pick"],
	"bozo will pick fruit off the kekklefruit tree",
	"pick",
	async msg => {
		const fruit = await KekklefruitTree.pickFruit();

		if (!fruit)
			return `There are not enough fruit on the kekklefruit tree.`;

		addItem(msg.p._id, fruit);
		return `(insert random boring message about ${fruit.name} here)`;
	}
);
