import { JsonArray, JsonValue } from "@prisma/client/runtime/library";
import { KekklefruitTree } from "../../../economy/kekkle";
import { Command } from "../../Command";
import { updateInventory } from "../../../data/inventory";

export const pick = new Command(
	"pick",
	["pick"],
	"bozo will pick fruit off the kekklefruit tree",
	"pick",
	async msg => {
		const fruit = await KekklefruitTree.pickFruit();

		if (!fruit)
			return `There are not enough fruit on the kekklefruit tree.`;

		(msg.inventory.items as JsonArray).push(fruit as unknown as JsonValue);
		console.log("updating inventory");
		await updateInventory(msg.inventory);

		return `(insert random boring message about ${fruit.name} here)`;
	}
);
