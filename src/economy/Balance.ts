import { loadConfig } from "../util/config";

const config = loadConfig("config/balance.yml", {
	symbol: " star bits",
	after: true,
	cutoff: 0
});

export function formatBalance(
	balance: number,
	symbol: string = config.symbol,
	after: boolean = config.after,
	cutoff: number = config.cutoff
) {
	if (after) return `${balance.toFixed(cutoff)}${symbol}`;
	else return `${symbol}${balance.toFixed(cutoff)}`;
}
