import { KekklefruitTree } from "../../../economy/kekkle";
import { Command } from "../../Command";

export const tree = new Command(
	"tree",
	["tree"],
	"bozo will get the amount of fruit on the kekklefruit tree",
	"tree",
	async msg => {
		return `There are ${KekklefruitTree.getFruitCount()} kekklefruit on the tree.`;
	},
	false
);
