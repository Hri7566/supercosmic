import { Item, StackableItem } from "../../../economy/Item";
import { Command } from "../../Command";

export const inventory = new Command(
	"inventory",
	["inventory", "inv"],
	"get bozo's inventory",
	"inventory",
	msg => {
		const items = msg.inventory.items as unknown as Item[];
		console.log(msg.inventory);
		const list = items
			.map(
				i =>
					`${i.name}${
						(i as StackableItem).count
							? " " + (i as StackableItem).count
							: ""
					}`
			)
			.join(" | ");

		return `Items: ${list ? list : "(none)"}`;
	}
);
