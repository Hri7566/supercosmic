import { deleteInventory } from "../../../data/inventory";
import { Command } from "../../Command";

export const delinv = new Command(
	"delinv",
	["delinv"],
	"delete a bozo's inventory",
	"delinv [id]",
	async (msg) => {
        let userId = msg.argv[1] ? msg.argv[1] : msg.p._id;
        await deleteInventory(userId);
        return `Inventory of \`${userId}\` deleted.`
	}
);
