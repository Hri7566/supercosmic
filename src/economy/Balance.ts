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
