import type { CommandMessage } from "../commands/CommandHandler";
import type { ServiceAgent } from "../services/ServiceAgent";
import { formatBalance, getBalance, setBalance } from "./Balance";
import type { CakeItem, Item } from "./Item";

export interface IEatReply {
	output?: string;
	consumed: boolean;
}

export type TEatBhv = (msg: CommandMessage, agent: ServiceAgent<unknown>, item: Item) => Promise<IEatReply>;

export const eatBhv = new Map<Item["id"], TEatBhv>();

eatBhv.set("kekklefruit", async (msg, agent) => {
	return {
		output: "kek eat bhv test",
		consumed: true
	};
});

eatBhv.set("cake", async (msg, agent, item) => {
	const cake = item as CakeItem;
	const balance = await getBalance(msg.user.id);

	if (typeof balance !== "number") return { output: "Somehow, you don't have a wallet to put stuff in, so you can't eat cake.", consumed: false };

	const money = Math.floor(Math.random() * 500);
	await setBalance(msg.user.id, balance + money);

	return {
		output: `You ate ${item.name} and your stomach turned it into ${formatBalance(money)}.`,
		consumed: true
	};
});
