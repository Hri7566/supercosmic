import { formatBalance } from "../../../economy/Balance";
import { Item, StackableItem } from "../../../economy/Item";
import { Command } from "../../Command";

export const balance = new Command(
	"balance",
	["balance", "bal", "money"],
	"get bozo's balance",
	"balance",
	(msg, agent) => {
		const bal = msg.inventory.balance;
		return `Balance: ${formatBalance(bal)}`;
	}
);
