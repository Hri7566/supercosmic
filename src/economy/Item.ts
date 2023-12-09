export interface Item {
	id: string;
	name: string;
}

export interface StackableItem extends Item {
	count: number;
}

export interface ConsumableItem extends Item {
	consumable: true;
}

export interface FoodItem extends ConsumableItem {
	edible: true;
}

export interface CakeItem extends FoodItem {
	emoji: string;
	icing: string;
	filling: string;
}

export interface ShopItem extends Item {
	buyValue: number;
	sellValue: number;
}
