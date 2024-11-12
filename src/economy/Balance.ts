import { readInventory, updateInventory } from "../data/inventory";
import { loadConfig } from "../util/config";

export const balanceConfig = loadConfig("config/balance.yml", {
	symbol: " star bits",
	after: true,
	cutoff: 0,
	defaultBalance: 0
});

export function formatBalance(
	balance: number,
	symbol: string = balanceConfig.symbol,
	after: boolean = balanceConfig.after,
	cutoff: number = balanceConfig.cutoff
) {
	if (after) return `${balance.toFixed(cutoff)}${symbol}`;
	else return `${symbol}${balance.toFixed(cutoff)}`;
}

export async function getBalance(id: string) {
	const inventory = await readInventory(id);
	if (!inventory) return balanceConfig.defaultBalance;
	return inventory.balance;
}

export async function setBalance(id: string, balance: number) {
	const inventory = await readInventory(id);
	if (!inventory) return false;
	inventory.balance = balance;
	await updateInventory(inventory);
	return true;
}
