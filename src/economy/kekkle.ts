import { get, set } from "../data/prisma";
import { Logger } from "../util/Logger";
import { FoodItem } from "./Item";

export class KekklefruitTree {
	protected static fruit: number = 0;
	public static logger = new Logger("Kekklefruit Tree");

	public static async saveFruit() {
		return set("kekklefruit-tree", this.fruit);
	}

	public static async loadFruit() {
		let fruit = await get<number>("kekklefruit-tree");
		let save = false;

		if (!fruit) {
			fruit = 0;
			save = true;
		}

		this.fruit = fruit;
		if (save) this.saveFruit();
	}

	public static async growFruit(amount: number = 1) {
		this.fruit += amount;
		await this.saveFruit();
	}

	public static getFruitCount() {
		return this.fruit;
	}

	public static async pickFruit() {
		if (this.fruit > 0) {
			this.fruit--;
			await this.saveFruit();
			return this.randomFruit();
		} else {
			return undefined;
		}
	}

	public static randomFruit() {
		return {
			id: "kekklefruit",
			name: "Kekklefruit",
			consumable: true,
			edible: true
		} as FoodItem;
	}
}

await KekklefruitTree.loadFruit();
