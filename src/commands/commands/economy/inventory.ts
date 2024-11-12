import { readItems } from "../../../data/inventory";
import { CakeItem, Item, StackableItem } from "../../../economy/Item";
import { Command } from "../../Command";

export const inventory = new Command(
	"inventory",
	["inventory", "inv"],
	"get bozo's inventory",
	"inventory",
	async msg => {
		const items = await readItems(msg.p._id);
		if (!items) return `Items: (none)`;

		console.log(typeof items, items);

		const list = items
			.map(
				i =>
					`${(i as CakeItem).emoji ? (i as CakeItem).emoji : ""}${i.name}${(i as StackableItem).count
						? " " + `(x${(i as StackableItem).count})`
						: ""
					}`
			)
			.join(" | ");

		return `Items: ${list ? list : "(none)"}`;
	}
);
