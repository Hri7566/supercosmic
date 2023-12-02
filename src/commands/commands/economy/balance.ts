import { formatBalance } from "../../../economy/Balance";
import { Command } from "../../Command";

export const balance = new Command(
	"balance",
	["balance", "bal", "money"],
	"get bozo's balance",
	"balance",
	msg => {
		const bal = msg.inventory.balance;
		return `Balance: ${formatBalance(bal)}`;
	}
);
