import { Item, StackableItem } from "../../../economy/Item";
import { Command } from "../../Command";
import { CommandHandler } from "../../CommandHandler";

export const inventory = new Command(
	"inventory",
	["inventory", "inv"],
	"get bozo's inventory",
	"inventory",
	(msg, agent) => {
		const items = msg.inventory.items as unknown as Item[];
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
