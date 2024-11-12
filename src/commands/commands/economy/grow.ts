import { KekklefruitTree } from "../../../economy/kekkle";
import { Command } from "../../Command";

export const grow = new Command(
	"grow",
	["grow"],
	"grow bozo's kekklefruit (forcefully)",
	"grow [number]",
	async msg => {
		let num: number;

		if (msg.argv[1]) {
			num = parseInt(msg.argv[1]);
			if (isNaN(num)) return `Need number bozo`;
		} else {
			num = 1;
		}

		await KekklefruitTree.growFruit(num);

		return `You grew ${num} fruit.`;
	}
);
